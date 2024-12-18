using Azure.Core;
using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class ClassService : IClassService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IClassRepository _classRepository;
        private readonly ITeacherRepository _teacherRepository;
        private readonly IUserRepository _userRepository;
        private readonly ISubjectRepository _subjectRepository;
        private readonly ITopicRepository _topicRepository;
        private readonly IClassStudyMaterialRepository _classStudyMaterialRepository;
        private readonly ISubjectExerciseRepository _subjectExerciseRepository;
        private readonly IClassTopicRepository _classTopicRepository;
        private readonly IClassExerciseRepository _classExerciseRepository;



        public ClassService(
              IStudentRepository studentRepository,
              IClassRepository classRepository,
              ITeacherRepository teacherRepository,
              IUserRepository userRepository,
              ISubjectRepository subjectRepository,
              IClassStudyMaterialRepository classStudyMaterialRepository,
              ITopicRepository topicRepository,
              ISubjectExerciseRepository subjectExerciseRepository,
              IClassTopicRepository classTopicRepository,
              IClassExerciseRepository classExerciseRepository)
        {
            _studentRepository = studentRepository;
            _classRepository = classRepository;
            _teacherRepository = teacherRepository;
            _userRepository = userRepository;
            _subjectRepository = subjectRepository;
            _classStudyMaterialRepository = classStudyMaterialRepository;
            _topicRepository = topicRepository;
            _subjectExerciseRepository = subjectExerciseRepository;
            _classTopicRepository = classTopicRepository;
            _classExerciseRepository = classExerciseRepository;
        }

        /// <summary>
        /// method to create a new class
        /// </summary>
        /// <param name="createClassRequest"></param>
        /// <returns></returns>
        public async Task<CommonResult<object>> CreateClass(CreateClassDTO createClassRequest, Stream stream)
        {
            try
            {
                var teacher = await _teacherRepository.GetByIdAsync(createClassRequest.TeacherId);
                if (teacher == null)
                {
                    return new CommonResult<object>()
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Teacher not found"
                    };
                }

                var subject = await _subjectRepository.GetByIdAsync(createClassRequest.SubjectId);
                if (subject == null)
                {
                    return new CommonResult<object>()
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Subject not found"
                    };
                }

                var studentIdStringList = new List<String>();

                // get all the studentId from the Excel file
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    var rowCount = worksheet.Dimension.Rows;

                    var expectedHeaders = new List<string>
                    {
                        "StudentId"
                    };

                    // Read the first row headers
                    var actualHeaders = new List<string>();
                    for (int col = 1; col <= 1; col++)
                    {
                        actualHeaders.Add(worksheet.Cells[1, col].Text.Trim());
                    }

                    // Compare actual headers with expected headers
                    for (int i = 0; i < expectedHeaders.Count; i++)
                    {
                        if (!string.Equals(expectedHeaders[i], actualHeaders[i], StringComparison.OrdinalIgnoreCase))
                        {
                            return new CommonResult<object>()
                            {
                                IsSuccess = false,
                                Code = 400,
                                Message = "The given file doesn't match the sample file"
                            };
                        }
                    }

                    if (rowCount < 2)
                    {
                        return new CommonResult<object>()
                        {
                            IsSuccess = false,
                            Code = 400,
                            Message = "No student found"
                        };
                    }

                    var errorMessages = new StringBuilder();
                    var hasError = false;

                    for (int row = 2; row <= rowCount; row++)
                    {
                        // Validate student fields
                        var studentId = worksheet.Cells[row, 1].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentId))
                        {
                            errorMessages.AppendLine($"Student Id is required on line {row}.");
                            hasError = true;
                        }
                        studentIdStringList.Add(studentId);
                    }
                }


                // Get all students that have IDs in the given list
                var foundStudents = await _studentRepository.FindListAsync(s => studentIdStringList.Contains(s.StudentIdString));

                // Extract the IDs of students that were found
                var foundIds = foundStudents.Select(s => s.StudentIdString).ToList();

                // Find IDs from the input list that weren't found in the database
                var notFoundIds = studentIdStringList.Except(foundIds).ToList();

                if (notFoundIds.Any())
                {
                    return new CommonResult<object>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = $"Students with the following IDs were not found: {string.Join(", ", notFoundIds)}"
                    };
                }

                // Create new class
                var newClass = new Class
                {
                    Name = createClassRequest.Name,
                    StartDate = createClassRequest.StartDate,
                    EndDate = createClassRequest.EndDate,
                    TeacherId = createClassRequest.TeacherId,
                    SubjectId = createClassRequest.SubjectId,
                    StudentClasses = new List<StudentClass>(),
                    CreatedAt = DateTime.UtcNow.AddHours(7),
                    CreatedById = createClassRequest.CurrentUserId,
                };

                foreach (var student in foundStudents)
                {
                    newClass.StudentClasses.Add(new StudentClass
                    {
                        StudentId = student.Id,
                        ClassId = newClass.Id,
                        Status = "Enrolled"
                    });
                }

                await _classRepository.AddAsync(newClass);
                await _classRepository.SaveAsync();

                return new CommonResult<object>()
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = $"Create class successfull"
                };
            }
            catch (Exception e)
            {
                return new CommonResult<object>()
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when creating class {e}"
                };
            }
        }


        /// <summary>
        /// method to show a list of classes depends on the user
        /// </summary>
        /// <param name="subject"></param>
        /// <param name="sortBy"></param>
        /// <param name="isDescending"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<CommonResult<List<ClassListDTO>>> GetClassesForUser(string? subject,
                                                                                        string sortBy,
                                                                                        bool isDescending,
                                                                                        int page,
                                                                                        int pageSize,
                                                                                        Guid userId)
        {
            // Get the user info
            var currentUserInfo = await _userRepository.GetByIdAsync(userId);
            if (currentUserInfo == null)
            {
                return new CommonResult<List<ClassListDTO>>
                {
                    IsSuccess = false,
                    Code = 404,
                    Message = "User not found."
                };
            }

            // Retrieve classes based on user position
            IEnumerable<Class> classes;

            if (currentUserInfo.Position == PositionEnum.Admin)
            {
                classes = await _classRepository.GetAllAsync();
            }
            else if (currentUserInfo.Position == PositionEnum.Teacher)
            {
                classes = await _classRepository.GetClassesByTeacherIdAsync(userId);
            }
            else
            {
                classes = await _classRepository.GetClassesByStudentIdAsync(userId);
            }

            // Apply filtering by subject if specified
            if (!string.IsNullOrEmpty(subject))
            {
                classes = classes.Where(c => c.Subject.Name.Equals(subject, StringComparison.OrdinalIgnoreCase));
            }

            // Apply sorting
            //classes = sortBy.ToLower() switch
            //{
            //    "name" => isDescending ? classes.OrderByDescending(c => c.Subject.Name) : classes.OrderBy(c => c.Subject.Name),
            //    "date" => isDescending ? classes.OrderByDescending(c => c.StartDate) : classes.OrderBy(c => c.StartDate),
            //    _ => classes
            //};

            // Map to DTOs
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

            //// Apply pagination
            //int totalRecords = classes.Count();
            //var paginatedClasses = classesDTO.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            //// Prepare the paginated result
            //var paginatedResult = new List<ClassDTO>
            //{
            //    Items = paginatedClasses,
            //    Page = page,
            //    PageSize = pageSize,
            //    TotalRecords = totalRecords
            //};

            return new CommonResult<List<ClassListDTO>>
            {
                IsSuccess = true,
                Code = 200,
                Data = classListDTO
            };
        }

        /// <summary>
        /// method to show a detail information of a class
        /// </summary>
        /// <param name="classId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<CommonResult<ClassDTO>> GetClassDetailForUser(Guid classId, Guid userId)
        {
            try
            {
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<ClassDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                var classEntity = await _classRepository.GetByIdAsync(classId);
                if (classEntity == null)
                {
                    return new CommonResult<ClassDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Class not found."
                    };
                }

                // teachers can only access a class they enrolled
                if (currentUserInfo.Position == PositionEnum.Teacher)
                {
                    if (classEntity.TeacherId != userId)
                    {
                        return new CommonResult<ClassDTO>
                        {
                            IsSuccess = false,
                            Code = 403,
                            Message = "Access denied. You are not teaching this class."
                        };
                    }
                }
                // students can only access a class they enrolled
                else if (currentUserInfo.Position == PositionEnum.Student)
                {
                    bool isEnrolled = classEntity.StudentClasses.Any(sc => sc.StudentId == userId);
                    if (!isEnrolled)
                    {
                        return new CommonResult<ClassDTO>
                        {
                            IsSuccess = false,
                            Code = 403,
                            Message = "Access denied. You are not enrolled in this class."
                        };
                    }
                }

                var classDTO = new ClassDTO
                {
                    Id = classEntity.Id,
                    StartDate = classEntity.StartDate,
                    EndDate = classEntity.EndDate,
                    NumberOfStudent = classEntity.StudentClasses.Count(),
                    TeacherName = classEntity.Teacher?.User?.Name,
                    SubjectName = classEntity.Subject?.Name
                };

                return new CommonResult<ClassDTO>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = "Success",
                    Data = classDTO
                };
            }catch(Exception e)
            {
                return new CommonResult<ClassDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when getting class {e}"
                };
            }
        }

      

        public async Task<CommonResult<List<ClassStudyMaterialDTO>>> GetStudyMaterialsForClassAsync(Guid classId, Guid userId)
        {
            var studyMaterials = await _classStudyMaterialRepository.GetByClassIdAsync(classId);

            return new CommonResult<List<ClassStudyMaterialDTO>>
            {
                IsSuccess = true,
                Data = studyMaterials.Select(sm => new ClassStudyMaterialDTO
                {
                    Id = sm.Id,
                    Title = sm.StudyMaterial.Title,
                    MaterialLink = sm.StudyMaterial.MaterialLink,
                    OpenDate = sm.OpenDate
                    // Additional properties as needed
                }).ToList()
            };
        }

        public async Task<CommonResult<List<ClassListDTO>>> GetClassesForSubject(Guid subjectId, Guid userId)
        {
            try
            {
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<List<ClassListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                // Check user position
                if (currentUserInfo.Position != PositionEnum.Admin && currentUserInfo.Position != PositionEnum.Teacher)
                {
                    return new CommonResult<List<ClassListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Unauthorzied."
                    };
                }

                var classes = await _classRepository.GetBySubjectIdAsync(subjectId);
                if (classes == null || !classes.Any())
                {
                    return new CommonResult<List<ClassListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "No class found."
                    };
                }

                var listClassDTO = classes.Select(e => new ClassListDTO
                {
                    Id = e.Id,
                    Name = e.Name,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    NumberOfStudent = e.StudentClasses.Count(),
                    TeacherName = e.Teacher.User.Name,
                    SubjectName = e.Subject.Name
                }).ToList();

                return new CommonResult<List<ClassListDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = listClassDTO
                };
            }
            catch (Exception e)
            {
                return new CommonResult<List<ClassListDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"There's a problem fetching the exercise data for subject {e}"
                };
            }
        }
        public async Task<CommonResult<ClassTopicOpenDTO>> OpenClassTopicAsync(OpenClassTopicDTO openClassTopicDTO, Guid userId)
        {
            // Validate input
            if (openClassTopicDTO == null)
                throw new ArgumentNullException(nameof(openClassTopicDTO));

            try
            {
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<ClassTopicOpenDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                if (currentUserInfo.Position != PositionEnum.Admin && currentUserInfo.Position != PositionEnum.Teacher)
                {
                    return new CommonResult<ClassTopicOpenDTO>
                    {
                        IsSuccess = false,
                        Code = 403,
                        Message = "Only admin can access"
                    };
                }

                // Validate class existence
                var currentClass = await _classRepository.GetByIdAsync(openClassTopicDTO.ClassId);
                if (currentClass == null)
                {
                    return new CommonResult<ClassTopicOpenDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Class not found."
                    };
                }

                // Validate topic existence
                var topic = await _topicRepository.GetByIdAsync(openClassTopicDTO.TopicId);
                if (topic == null)
                {
                    return new CommonResult<ClassTopicOpenDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Topic not found."
                    };
                }

                // Check if the topic belongs to the class's subject
                if (topic.SubjectId != currentClass.SubjectId)
                {
                    return new CommonResult<ClassTopicOpenDTO>
                    {
                        IsSuccess = false,
                        Code = 400,
                        Message = "The topic does not belong to the subject of this class."
                    };
                }

                // Fetch all exercises for the topic, without filtering by selected exercises
                var validSubjectExercises = await _subjectExerciseRepository.GetSubjectExercisesByTopicIdAsync(openClassTopicDTO.TopicId);

                if (!validSubjectExercises.Any())
                {
                    return new CommonResult<ClassTopicOpenDTO>
                    {
                        IsSuccess = false,
                        Code = 400,
                        Message = "No exercises available for this topic."
                    };
                }

                // Check for conflicting timeframes
                var existingClassTopic = await _classTopicRepository.GetActiveClassTopicAsync(
                    openClassTopicDTO.ClassId, openClassTopicDTO.TopicId, openClassTopicDTO.StartDate, openClassTopicDTO.EndDate
                );
                if (existingClassTopic != null)
                {
                    return new CommonResult<ClassTopicOpenDTO>
                    {
                        IsSuccess = false,
                        Code = 400,
                        Message = "A topic with overlapping timeframe is already open for this class."
                    };
                }

                // Create ClassTopicOpen entry
                var classTopicOpen = new ClassTopicOpen
                {
                    Id = Guid.NewGuid(),
                    ClassId = openClassTopicDTO.ClassId,
                    TopicId = openClassTopicDTO.TopicId,
                    StartDate = openClassTopicDTO.StartDate,
                    EndDate = openClassTopicDTO.EndDate,
                    CreatedDate = DateTime.UtcNow.AddHours(7)
                };

                await _classTopicRepository.AddAsync(classTopicOpen);

                var classTopicExercises = validSubjectExercises.Select(e => new ClassExercise
                {
                    Id = Guid.NewGuid(),
                    ClassTopicOpenId = classTopicOpen.Id,
                    SubjectExerciseId = e.Id,
                    ExerciseId = e.ExerciseId,
                }).ToList();

                await _classExerciseRepository.AddRangeAsync(classTopicExercises);
                await _classTopicRepository.SaveAsync();

                // Map to DTO for response
                var resultDTO = new ClassTopicOpenDTO
                {
                    Id = classTopicOpen.Id,
                    StartDate = classTopicOpen.StartDate,
                    EndDate = classTopicOpen.EndDate,
                    CreatedDate = classTopicOpen.CreatedDate,
                    ClassDTO = new ClassDTO
                    {
                        Id = currentClass.Id,
                        Name = currentClass.Name
                    },
                    TopicDTO = new TopicDTO
                    {
                        Id = topic.Id,
                        Name = topic.Name
                    }
                };

                return new CommonResult<ClassTopicOpenDTO>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = "Class topic opened successfully.",
                    Data = resultDTO
                };
            }
            catch (Exception ex)
            {
                return new CommonResult<ClassTopicOpenDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"An error occurred while opening the class topic: {ex.Message}"
                };
            }
        }

        public async Task<CommonResult<List<TopicDTO>>> GetAvailableClassTopicAsync(Guid classId, Guid userId)
        {
            try
            {
                // Check if the class exists and is accessible by the user
                var classExists = await _classRepository.GetByIdAsync(classId);
                if (classExists == null)
                {
                    return new CommonResult<List<TopicDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Class not found."
                    };
                }

                var topics = await _topicRepository.FindListAsync(t => t.SubjectId == classExists.SubjectId && t.IsDeleted == false);
                var topicDTOs = topics.Select(t => new TopicDTO
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description
                }).ToList();

                return new CommonResult<List<TopicDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = "Class topic opened successfully.",
                    Data = topicDTOs
                };
            }
            catch (Exception ex)
            {
                // Log exception (not included in this snippet)
                return new CommonResult<List<TopicDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"An error occurred while opening the class topic: {ex.Message}"
                };
            }
        }

        public async Task<CommonResult<List<ClassTopicOpenListDTO>>> GetOpenClassTopicAsync(Guid classId, Guid userId)
        {
            try
            {
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<List<ClassTopicOpenListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                var classTopics = await _classTopicRepository.GetAllClassTopicAsync(classId);
                if(classTopics == null || !classTopics.Any())
                {
                    return new CommonResult<List<ClassTopicOpenListDTO>>
                    {
                        IsSuccess = false,
                        Code = 400,
                        Message = $"No topic found",
                    };
                }

                var result = classTopics.Select(cto => new ClassTopicOpenListDTO
                {
                    Id = cto.Id,
                    Name = cto.Topic.Name,
                    StartDate = cto.StartDate,
                    EndDate = cto.EndDate,
                    CreatedDate = cto.CreatedDate,
                    TopicDTO = new TopicDTO
                    {
                        Id = cto.Topic.Id,
                        Name = cto.Topic.Name,
                        Description = cto.Topic.Description,
                    },
                    ClassExerciseListDTOs = cto.ClassExercises.Select(se => new ExerciseListDTO
                    {
                        Id = se.Id,
                        Title = se.SubjectExercise.Exercise.Title,
                        Description = se.SubjectExercise.Exercise.Description,
                        Difficulty = (int)se.SubjectExercise.Exercise.Difficulty,
                    }).ToList()
                }).ToList();

                return new CommonResult<List<ClassTopicOpenListDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = result
                };

            }
            catch (Exception ex)
            {
                return new CommonResult<List<ClassTopicOpenListDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error retrieving topics: {ex.Message}",
                }; 
            }
        }


        /// <summary>
        /// method to get all exercises that has opened inside a class
        /// </summary>
        /// <param name="classId"></param>
        /// <returns></returns>
        //public async Task<CommonResult<List<ExerciseDTO>>> GetExercisesByClassAsync(Guid classId, Guid userId)
        //{
        //    var exercises = await _exerciseRepository.GetExercisesByClassAsync(classId);

        //    return new CommonResult<List<ExerciseDTO>>
        //    {
        //        IsSuccess = true,
        //        Data = exercises.Select(e => new ExerciseDTO
        //        {
        //            Id = e.Id,
        //            Title = e.Title,
        //            Description = e.Description,
        //            // Additional properties as needed
        //        }).ToList()
        //    };
        //}
    }
}
