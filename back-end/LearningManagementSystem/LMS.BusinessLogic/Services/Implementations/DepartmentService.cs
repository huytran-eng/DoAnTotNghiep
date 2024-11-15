using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IUniversityRepository _universityRepository;
        private readonly ITeacherRepository _teacherRepository;
        private readonly IUserRepository _userRepository;
        private readonly ISubjectRepository _subjectRepository;


        public DepartmentService(
              IStudentRepository studentRepository,
              IClassRepository classRepository,
              ITeacherRepository teacherRepository,
              IUserRepository userRepository,
              ISubjectRepository subjectRepository)
        {
            _studentRepository = studentRepository;
            _classRepository = classRepository;
            _teacherRepository = teacherRepository;
            _userRepository = userRepository;
            _subjectRepository = subjectRepository;
        }

        public async Task<CommonResult<DepartmentDTO>> CreateDepartmentAsync(DepartmentCreateDTO departmentCreateDTO)
        {
            var university = await _departmentRepository.FindAsync(u => true);

            if (university == null)
            {
                return new CommonResult<DepartmentDTO>
                {
                    IsSuccess = false,
                    Code=400,
                    Message = "No university in database."
                };
            }

            // Map DTO to entity
            var newDepartment = new Department
            {
                Id = Guid.NewGuid(),
                Name = departmentCreateDTO.Name,
                Description = departmentCreateDTO.Description,
                UniversityId = university.Id,
                CreatedAt = DateTime.Now,
                CreatedById = departmentCreateDTO.CurrentUserId,
            };
            try
            {
                // Save department to database
                await _departmentRepository.AddAsync(newDepartment);

                await _departmentRepository.SaveAsync();

                return new CommonResult<DepartmentDTO>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message ="Department added successfully"
                };
            }
            catch (Exception ex)
            {
                return new CommonResult<DepartmentDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when inserting to database {ex.Message}"
                };
            }
        }

    }
}
