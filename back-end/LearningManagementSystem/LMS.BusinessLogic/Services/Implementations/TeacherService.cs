using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.Core.Helper;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using System.Security.Policy;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class TeacherService : ITeacherService
    {
        private readonly ITeacherRepository _teacherRepository;
        private readonly IUserRepository _userRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IClassRepository _classRepository;

        public TeacherService(ITeacherRepository teacherRepository, IUserRepository userRepository, IDepartmentRepository departmentRepository, IClassRepository classRepository)
        {
            _teacherRepository = teacherRepository;
            _userRepository = userRepository;
            _departmentRepository = departmentRepository;
            _classRepository = classRepository;
        }

        public async Task<CommonResult<TeacherDTO>> CreateAsync(CreateTeacherDTO teacherDTO)
        {
            try
            {
                var existingUserWithEmail = await _userRepository.GetByEmailAsync(teacherDTO.Email);
                if (existingUserWithEmail != null)
                {
                    return new CommonResult<TeacherDTO>
                    {
                        IsSuccess = false,
                        Code = 400,
                        Message = "The email provided is already in use."
                    };
                }

                var departmentExists = await _departmentRepository.GetByIdAsync(teacherDTO.DepartmentId);
                if (departmentExists == null)
                {
                    return new CommonResult<TeacherDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "The provided Department ID does not exist."
                    };
                }

                var nameParts = teacherDTO.Name.Split(' ');

                // Ensure there is at least a first name and a last name.
                if (nameParts.Length < 2)
                {
                    return new CommonResult<TeacherDTO>
                    {
                        IsSuccess = false,
                        Code = 400,
                        Message = "The name must contain at least a first name and a last name."
                    };
                }

                // get vietnamese first name
                var firstName = nameParts.Last();

                // Get the last name and the middle name parts.
                var lastAndMiddleNameParts = nameParts.Take(nameParts.Length - 1).ToList();

                // Create a username by combining the first name and the initials from the last and middle name parts
                var lastAndMiddleNameInitials = string.Concat(lastAndMiddleNameParts.Select(part => part.Substring(0, 1).ToUpper()));

                // Remove Vietnamese accents from the first name and initials
                firstName = StringHelper.RemoveVietnameseDiacritics(firstName);
                lastAndMiddleNameInitials = StringHelper.RemoveVietnameseDiacritics(lastAndMiddleNameInitials);

                // Generate the base username: Last name initial + First name initial.
                string baseUsername = $"{firstName}{lastAndMiddleNameInitials.ToUpper()}";

                // Fetch all users whose username starts with the base username.
                var usersWithSamePrefix = await _userRepository.GetUsersWithPrefixAsync(baseUsername);

                // Find the highest index number used for this base username.
                int maxIndex = 0;
                foreach (var u in usersWithSamePrefix)
                {
                    var indexPart = u.Username.Substring(baseUsername.Length);
                    if (int.TryParse(indexPart, out int index))
                    {
                        maxIndex = Math.Max(maxIndex, index); // Track the highest index.
                    }
                }

                // Generate the new username by appending the next available index, starting with 001.
                string username = $"{baseUsername}{(maxIndex + 1):000}";

                // Generate a default password as "LastName + BirthDate" (e.g., Doe19900101).
                string defaultPassword = $"{firstName}{teacherDTO.BirthDate:ddMMyyyy}";
                var (hash, salt) = PasswordHelper.CreatePasswordHash(defaultPassword);

                // Create a new user based on the provided DTO.
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Username = username,  // Use the generated unique username
                    Name = teacherDTO.Name,
                    BirthDate = teacherDTO.BirthDate,
                    Email = teacherDTO.Email,
                    Address = teacherDTO.Address,
                    Phone = teacherDTO.Phone,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    Position = PositionEnum.Teacher
                };

                // Add the user to the repository.
                await _userRepository.AddAsync(user);

                // Create a new teacher with the associated user.
                var teacher = new Teacher { Id = Guid.NewGuid(), DepartmentId = teacherDTO.DepartmentId, User = user };

                // Generate a default password as "LastName + BirthDate" (e.g., Doe19900101).
                // Map the Teacher entity to TeacherDTO for the response.
                var teacherDTOResult = new TeacherDTO
                {
                    Id = user.Id,
                    Username = teacher.User.Username,
                    Name = teacher.User.Name,
                    BirthDate = teacher.User.BirthDate,
                    Email = teacher.User.Email,
                    Address = teacher.User.Address,
                    Phone = teacher.User.Phone,
                    Position = teacher.User.Position
                };
                await _teacherRepository.AddAsync(teacher);
                await _teacherRepository.SaveAsync();
                // Return success result.
                return new CommonResult<TeacherDTO>
                {
                    IsSuccess = true,
                    Message = "Teacher created successfully.",
                    Code = 200,
                    Data = teacherDTOResult
                };
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., database issues, validation errors).
                return new CommonResult<TeacherDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"An error occurred while creating the teacher: {ex.Message}",
                };
            }
        }

        public async Task<CommonResult<TeacherDTO>> EditTeacherAsync(Guid teacherId, EditTeacherDTO teacherDTO)
        {
            try
            {
                // Retrieve the teacher by ID, including the associated User entity.
                var teacher = await _teacherRepository.GetByIdAsync(teacherId);
                if (teacher == null)
                {
                    return new CommonResult<TeacherDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Không tìm thấy thông tin giảng viên."
                    };
                }

                // Check if the department exists.
                var departmentExists = await _departmentRepository.GetByIdAsync(teacherDTO.DepartmentId);
                if (departmentExists == null)
                {
                    return new CommonResult<TeacherDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "The provided Department ID does not exist."
                    };
                }

                var user = teacher.User;
                if (user == null)
                {
                    return new CommonResult<TeacherDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Không tìm thấy thông tin người dùng."
                    };
                }


                // Validate email if it has been updated.
                if (!string.Equals(teacher.User.Email, teacherDTO.Email, StringComparison.OrdinalIgnoreCase))
                {
                    var existingUserWithEmail = await _userRepository.GetByEmailAsync(teacherDTO.Email);
                    if (existingUserWithEmail != null)
                    {
                        return new CommonResult<TeacherDTO>
                        {
                            IsSuccess = false,
                            Code = 400,
                            Message = "Email đã được sử dụng."
                        };
                    }
                }

                // Update the teacher's User entity.
                user.Name = teacherDTO.Name;
                user.Email = teacherDTO.Email;
                user.Address = teacherDTO.Address;
                user.Phone = teacherDTO.Phone;
                if (user.BirthDate != teacherDTO.BirthDate)
                {
                    user.BirthDate = teacherDTO.BirthDate;

                    // Generate a new default password as "LastName + BirthDate" (e.g., Doe19900101).
                    var firstName = StringHelper.RemoveVietnameseDiacritics(user.Name.Split(' ').Last());
                    string newDefaultPassword = $"{firstName}{teacherDTO.BirthDate:ddMMyyyy}";
                    var (hash, salt) = PasswordHelper.CreatePasswordHash(newDefaultPassword);

                    // Update the password hash and salt.
                    user.PasswordHash = hash;
                    user.PasswordSalt = salt;
                }
                await _userRepository.UpdateAsync(user);

                // Update the teacher's Department ID.
                teacher.DepartmentId = teacherDTO.DepartmentId;

                // Save changes to the database.
                await _teacherRepository.UpdateAsync(teacher);

                await _teacherRepository.SaveAsync();

                // Map the updated Teacher entity to a TeacherDTO for the response.
                var teacherDTOResult = new TeacherDTO
                {
                    Id = teacher.User.Id,
                    Username = teacher.User.Username,
                    Name = teacher.User.Name,
                    BirthDate = teacher.User.BirthDate,
                    Email = teacher.User.Email,
                    Address = teacher.User.Address,
                    Phone = teacher.User.Phone,
                    Position = teacher.User.Position
                };

                // Return success result.
                return new CommonResult<TeacherDTO>
                {
                    IsSuccess = true,
                    Message = "Thay đổi thông tin giáo viên thành công.",
                    Code = 200,
                    Data = teacherDTOResult
                };
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., database issues, validation errors).
                return new CommonResult<TeacherDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Có lỗi xảy ra khi thay đổi thông tin giáo viên: {ex.Message}",
                };
            }
        }


        public async Task<CommonResult<List<TeacherListDTO>>> GetAllTeachers()
        {
            try
            {
                var teachers = await _teacherRepository.GetAllAsync();
                var teacherListDTO = teachers.Select(t => new TeacherListDTO
                {
                    Id = t.Id,
                    Name = t.User.Name,
                    BirthDate = t.User.BirthDate,
                    Email = t.User.Email,
                    Address = t.User.Address,
                    Phone = t.User.Phone
                }).ToList();

                return new CommonResult<List<TeacherListDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = teacherListDTO
                };
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., database issues, validation errors).
                return new CommonResult<List<TeacherListDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"An error occurred while getting the teacher list: {ex.Message}",
                };
            }

        }

        public async Task<CommonResult<List<TeacherListDTO>>> GetTeachersByDepartmentIdAsync(Guid departmentId)
        {
            try
            {
                var teachers = await _teacherRepository.GetByDepartmentIdAsync(departmentId);
                var teacherListDTO = teachers.Select(t => new TeacherListDTO
                {
                    Id = t.Id,
                    Name = t.User.Name,
                    BirthDate = t.User.BirthDate,
                    Email = t.User.Email,
                    Address = t.User.Address,
                    Phone = t.User.Phone
                }).ToList();

                return new CommonResult<List<TeacherListDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = teacherListDTO
                };
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., database issues, validation errors).
                return new CommonResult<List<TeacherListDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"An error occurred while getting the teacher list: {ex.Message}",
                };
            }

        }

        public async Task<CommonResult<TeacherDetailDTO>> GetTeacherDetail(Guid teacherId)
        {
            try
            {
                var teacher = await _teacherRepository.GetByIdAsync(teacherId);

                if (teacher == null)
                {
                    return new CommonResult<TeacherDetailDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Không tìm thấy thông tin giảng viên"
                    };

                }

                var classes = await _classRepository.GetClassesByTeacherIdAsync(teacherId);
                var currentDate = DateTime.Now;

                var classListDTO = classes.Select(c => new ClassListDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    TeacherName = c.Teacher.User.Name,
                    SubjectName = c.Subject.Name,
                    NumberOfStudent = c.StudentClasses.Count(),
                    // class status: 
                    // 0: not open
                    // 1: opening
                    // 2: closed
                    Status = c.StartDate > currentDate ? 0 :
                    (c.StartDate <= currentDate && c.EndDate >= currentDate) ? 1 : 2
                }).OrderBy(dto => dto.Status != 1)
                 .ThenBy(dto => dto.StartDate).ToList();

                var teacherDetail = new TeacherDetailDTO
                {
                    Id = teacher.Id,
                    Username = teacher.User.Username,
                    Name = teacher.User.Name,
                    BirthDate = teacher.User.BirthDate,
                    Email = teacher.User.Email,
                    Address = teacher.User.Address,
                    Phone = teacher.User.Phone,
                    NumberOfClasses = classListDTO.Count,
                    Classes = classListDTO,
                    DepartmentId = teacher.DepartmentId
                };
                return new CommonResult<TeacherDetailDTO>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = teacherDetail
                };
            }
            catch (Exception ex)
            {
                return new CommonResult<TeacherDetailDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"An error occurred while getting teacher detail: {ex.Message}"
                };
            }
        }
    }
}
