using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class TeacherService : ITeacherService
    {
        private readonly ITeacherRepository _teacherRepository;
        private readonly IUserRepository _userRepository;

        public TeacherService(ITeacherRepository teacherRepository, IUserRepository userRepository)
        {
            _teacherRepository = teacherRepository;
            _userRepository = userRepository;
        }

        public async Task<CommonResult<TeacherDTO>> CreateAsync(TeacherDTO teacherDTO)
        {
            try
            {
                // Create a new user based on the provided DTO.
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Username = teacherDTO.Username,
                    Name = teacherDTO.Name,
                    BirthDate = teacherDTO.BirthDate,
                    Email = teacherDTO.Email,
                    Address = teacherDTO.Address,
                    Phone = teacherDTO.Phone,
                    Position = PositionEnum.Teacher
                };

                // Add the user to the repository.
                await _userRepository.AddAsync(user);

                // Create a new teacher with the associated user.
                var teacher = new Teacher { Id = Guid.NewGuid(), User = user };
                await _teacherRepository.AddAsync(teacher);

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
                    Message = $"An error occurred while creating the teacher: {ex.Message}",
                };
            }
        }
    }
}
