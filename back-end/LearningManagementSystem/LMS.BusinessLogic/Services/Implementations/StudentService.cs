using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.Core.Helper;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using OfficeOpenXml;
using System.Globalization;
using System.Text;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IClassRepository _classRepository;
        private readonly IStudentSubmissonRepository _studentSubmissionRepository;


        public StudentService(IStudentRepository studentRepository, IUserRepository userRepository, IClassRepository classRepository, IStudentSubmissonRepository studentSubmissionRepository)
        {
            _studentRepository = studentRepository;
            _userRepository = userRepository;
            _classRepository = classRepository;
            _studentSubmissionRepository = studentSubmissionRepository;
        }

        public async Task<CommonResult<IEnumerable<ClassDTO>>> GetClassesForStudent(Guid studentId, string? search, string? sortBy, bool descending)
        {
            var classes = await _classRepository.GetClassesForStudent(studentId);

            if (!string.IsNullOrEmpty(search))
            {
                classes = classes.Where(c => c.Subject.Name.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            if (!classes.Any())
            {
                return new CommonResult<IEnumerable<ClassDTO>>
                {
                    IsSuccess = false,
                    Code = 404,
                    Message = "No class found"
                };
            }

            classes = sortBy switch
            {
                "name" => descending ? classes.OrderByDescending(c => c.Subject.Name) : classes.OrderBy(c => c.Subject.Name),
                "startDate" => descending ? classes.OrderByDescending(c => c.StartDate) : classes.OrderBy(c => c.StartDate),
                "endDate" => descending ? classes.OrderByDescending(c => c.EndDate) : classes.OrderBy(c => c.EndDate),
                _ => classes
            };

            var classDTOs = classes.Select(c => new ClassDTO
            {
                Id = c.Id,
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                Teacher = new TeacherDTO
                {
                    Name = c.Teacher.User.Name,
                },
                Subject = new SubjectDTO
                {
                    Id = c.Subject.Id,
                    Name = c.Subject.Name,
                    Credit = c.Subject.Credit,
                    Description = c.Subject.Description
                }
            });

            return new CommonResult<IEnumerable<ClassDTO>>
            {
                IsSuccess = true,
                Code = 200,
                Message = "Classes retrieved successfully",
                Data = classDTOs
            };


        }


        /// <summary>
        /// Method to imports list of student from an excel file
        /// </summary>
        /// <param name="stream">stream of excel file</param>
        /// <returns></returns>
        public async Task<CommonResult<StudentDTO>> ImportStudents(Stream stream)
        {
            var students = new List<Student>();
            try
            {
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    var rowCount = worksheet.Dimension.Rows;

                    var expectedHeaders = new List<string>
                    {
                        "StudentId", "Student Name", "Birth Date", "Email",
                        "Address", "Phone"
                    };

                    // Read the first row headers
                    var actualHeaders = new List<string>();
                    for (int col = 1; col <= 6; col++)
                    {
                        actualHeaders.Add(worksheet.Cells[1, col].Text.Trim());
                    }

                    // Compare actual headers with expected headers
                    for (int i = 0; i < expectedHeaders.Count; i++)
                    {
                        if (!string.Equals(expectedHeaders[i], actualHeaders[i], StringComparison.OrdinalIgnoreCase))
                        {
                            return new CommonResult<StudentDTO>()
                            {
                                IsSuccess = false,
                                Code = 400,
                                Message = "The given file doesn't match the sample file"
                            };
                        }
                    }

                    if (rowCount < 2)
                    {
                        return new CommonResult<StudentDTO>()
                        {
                            IsSuccess = false,
                            Code = 400,
                            Message = "No student found"
                        };
                    }

                    var dateFormats = new[] { "dd/MM/yyyy", "d/M/yyyy" };
                    var errorMessages = new StringBuilder();
                    var hasError = false;

                    // Loop through every row of the excel file
                    for (int row = 2; row <= rowCount; row++)
                    {
                        // Validate student fields
                        var studentId = worksheet.Cells[row, 1].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentId))
                        {
                            errorMessages.AppendLine($"Student Id is required on line {row}.");
                            hasError = true;
                        }

                        var studentName = worksheet.Cells[row, 2].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentName))
                        {
                            errorMessages.AppendLine($"Student name is required on line {row}.");
                            hasError = true;
                        }

                        if (!DateTime.TryParseExact(worksheet.Cells[row, 3].Text, dateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime birthDate))
                        {
                            errorMessages.AppendLine($"Invalid birth date on line {row}.");
                            hasError = true;
                        }

                        var studentEmail = worksheet.Cells[row, 4].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentEmail))
                        {
                            errorMessages.AppendLine($"Student email is required on line {row}.");
                            hasError = true;
                        }

                        var studentAddress = worksheet.Cells[row, 5].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentAddress))
                        {
                            errorMessages.AppendLine($"Student address is required on line {row}.");
                            hasError = true;
                        }

                        var studentPhone = worksheet.Cells[row, 6].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentPhone))
                        {
                            errorMessages.AppendLine($"Student phone is required on line {row}.");
                            hasError = true;
                        }

                        if (hasError)
                            continue;

                        // Generate student password hash and salt based on student ID
                        var (hash, salt) = PasswordHelper.CreatePasswordHash(studentId.ToLower());

                        var currentUser = new User
                        {
                            Id = Guid.NewGuid(),
                            Username = studentId,
                            Name = studentName,
                            Email = studentEmail,
                            PasswordHash = hash,
                            PasswordSalt = salt,
                            Address = studentAddress,
                            Phone = studentPhone,
                            Position = PositionEnum.Student,
                            BirthDate = birthDate
                        };

                        var currentStudent = new Student
                        {
                            StudentIdString = studentId,
                            User = currentUser,
                        };

                        students.Add(currentStudent);
                    }

                    if (hasError)
                    {
                        return new CommonResult<StudentDTO>
                        {
                            IsSuccess = false,
                            Code = 400,
                            Message = errorMessages.ToString()
                        };
                    }

                    // Add students to the database
                    foreach (var student in students)
                    {
                        await _userRepository.AddAsync(student.User);
                        await _studentRepository.AddAsync(student);
                    }

                    await _studentRepository.SaveAsync();

                    return new CommonResult<StudentDTO>
                    {
                        IsSuccess = true,
                        Code = 200,
                        Message = "Students added successfully"
                    };
                }
            }
            catch (Exception ex)
            {
                return new CommonResult<StudentDTO>
                {
                    IsSuccess = true,
                    Code = 500,
                    Message = "Error reading excel file " + ex.Message
                };
            }
        }

        public async Task<CommonResult<List<StudentDTO>>> GetStudentsForAdmin(
           string? studentName,
           string sortBy,
           bool isDescending,
           int page,
           int pageSize,
           Guid userId)
        {
            try
            {
                // Get the user info
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<List<StudentDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                // Retrieve subjects based on user position

                var students = await _studentRepository.GetAllAsync();

                if (students == null || students.Count() < 1)
                {
                    return new CommonResult<List<StudentDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "No students found"
                    };

                }


                var studentListDTO = students.Select(s => new StudentDTO
                {
                    Id = s.Id,
                    StudentIdString = s.StudentIdString,
                    Name = s.User.Name,
                    BirthDate = s.User.BirthDate,
                    Email = s.User.Email,
                    Address = s.User.Address,
                    Phone = s.User.Phone
                }).ToList();

                return new CommonResult<List<StudentDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = studentListDTO
                };


            }
            catch (Exception e)
            {
                return new CommonResult<List<StudentDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when getting students list {e}"
                };
            }
        }

        public async Task<CommonResult<List<StudentClassListDTO>>> GetStudentsForClass(Guid classId, Guid userId)
        {
            try
            {
                // Get the user info
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<List<StudentClassListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                var students = await _studentRepository.GetStudentsByClassAsync(classId);

                if (students == null || students.Count() < 1)
                {
                    return new CommonResult<List<StudentClassListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "No students found"
                    };

                }

                var studentListDTO = new List<StudentClassListDTO>();

                foreach (var student in students)
                {
                    var submissions = await _studentSubmissionRepository.GetSubmissionsByStudentIdAndClassIdAsync(student.Id, classId);

                    // Group submissions by ExerciseId
                    var groupedSubmissions = submissions.GroupBy(s => s.ClassExercise.ExerciseId);

                    var exercisesDone = groupedSubmissions.Count();
                    var exercisesCorrect = groupedSubmissions.Count(g => g.Any(s => s.Status == 0));


                    studentListDTO.Add(new StudentClassListDTO
                    {
                        Id = student.Id,
                        StudentIdString = student.StudentIdString,
                        Name = student.User.Name,
                        ExercisesDone = exercisesDone,
                        ExercisesCorrect = exercisesCorrect
                    });
                }

                return new CommonResult<List<StudentClassListDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = studentListDTO
                };
            }
            catch (Exception e)
            {
                return new CommonResult<List<StudentClassListDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when getting students list {e}"
                };
            }
        }

        public async Task<CommonResult<StudentClassDetailDTO>> GetStudentForClass(Guid classId, Guid studentId, Guid userId)
        {
            try
            {
                // Get the user info
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<StudentClassDetailDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                // Get the student details by studentId and classId
                var student = await _studentRepository.GetByIdAsync(studentId);

                if (student == null)
                {
                    return new CommonResult<StudentClassDetailDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Student not found"
                    };
                }

                var classDetails = await _classRepository.GetByIdAsync(classId); // Assuming _classRepository is your class repository
                if (classDetails == null)
                {
                    return new CommonResult<StudentClassDetailDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Class not found."
                    };
                }

                var submissions = await _studentSubmissionRepository.GetSubmissionsByStudentIdAndClassIdAsync(student.Id, classId);

                // Group submissions by ExerciseId
                var groupedSubmissions = submissions.GroupBy(s => s.ClassExercise.ExerciseId);

                var exercisesDone = groupedSubmissions.Count();
                var exercisesCorrect = groupedSubmissions.Count(g => g.Any(s => s.Status == 0));

                var studentDTO = new StudentClassDetailDTO
                {
                    Id = student.Id,
                    StudentIdString = student.StudentIdString,
                    ExercisesDone = exercisesDone,
                    ExercisesCorrect = exercisesCorrect,
                    ClassName = classDetails.Name,
                    SubjectName = classDetails.Subject.Name
                };

                return new CommonResult<StudentClassDetailDTO>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = studentDTO
                };
            }
            catch (Exception e)
            {
                return new CommonResult<StudentClassDetailDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when getting student details: {e}"
                };
            }
        }

        public async Task<CommonResult<StudentDTO>> GetStudentDetails(Guid id)
        {
            try
            {
                var student = await _studentRepository.GetByIdAsync(id);
                if (student == null)
                {
                    return new CommonResult<StudentDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Student not found."
                    };
                }

                var studentDetailsDto = new StudentDTO
                {
                    Id = student.Id,
                    StudentIdString = student.StudentIdString,
                    Name = student.User.Name,
                    BirthDate = student.User.BirthDate,
                    Email = student.User.Email,
                    Address = student.User.Address,
                    Phone = student.User.Phone,
                };

                return new CommonResult<StudentDTO>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = studentDetailsDto
                };
            }
            catch (Exception e)
            {
                return new CommonResult<StudentDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when getting student details: {e}"
                };
            }
        }

        public async Task<CommonResult<List<ClassListDTO>>> GetStudentClasses(Guid id)
        {
            try
            {
                var classes = await _classRepository.GetClassesByStudentIdAsync(id);

                var classListDTO = classes.Select(c => new ClassListDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    TeacherName = c.Teacher.User.Name,
                    SubjectName = c.Subject.Name,
                    NumberOfStudent = c.StudentClasses.Count()
                }).ToList();

                return new CommonResult<List<ClassListDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = classListDTO
                };
            }
            catch (Exception e)
            {
                return new CommonResult<List<ClassListDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when getting student classes: {e}"
                };
            }
        }
    }
}
