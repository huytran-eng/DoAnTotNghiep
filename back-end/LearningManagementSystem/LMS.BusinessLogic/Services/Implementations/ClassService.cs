using Azure.Core;
using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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


        public ClassService(
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

        public async Task<CommonResult<object>> CreateClass(CreateClassRequest createClassRequest)
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

            // Get all students that have IDs in the given list
            var studentQuery = await _studentRepository.FindListAsync(s => createClassRequest.StudentIds.Contains(s.Id));

            var foundStudents = await studentQuery.ToListAsync();
            // Extract the IDs of students that were found
            var foundIds = studentQuery.Select(s => s.Id).ToList();

            // Find IDs from the input list that weren't found in the database
            var notFoundIds = createClassRequest.StudentIds.Except(foundIds).ToList();

            if (notFoundIds.Any())
            {
                return new CommonResult<object>()
                {
                    IsSuccess = false,
                    Code = 404,
                    Message = $"Students with the following IDs were not found: {string.Join(", ", notFoundIds)}"
                };
            }

            // Create new class
            var newClass = new Class
            {
                StartDate = createClassRequest.StartDate,
                EndDate = createClassRequest.EndDate,
                TeacherId = createClassRequest.TeacherId,
                SubjectId = createClassRequest.SubjectId,
                StudentClasses = new List<StudentClass>(),
                CreatedAt = DateTime.Now,
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
                IsSuccess = false,
                Code = 200,
                Message = $"Create class successfull"
            };
        }

        public async Task<CommonResult<PaginatedResultDTO<ClassDTO>>> GetClassesForUser(ViewClassRequestDTO request)
        {
            var currentUserInfo = await _userRepository.GetByIdAsync(request.CurrentUserId);
            List<Class> classes;

            // Chose classes retreive logic based on user position
            if (currentUserInfo.Position == PositionEnum.Admin)
            {
                classes = await _classRepository.GetAllAsync();
            }
            else if (currentUserInfo.Position == PositionEnum.Teacher)
            {
                classes = await _classRepository.GetByTeacherIdAsync(request.UserDTO.Id);
            }
            else
            {
                classes = await _classRepository.GetByStudentIdAsync(request.UserDTO.Id);
            }

            // Apply filtering
            if (!string.IsNullOrEmpty(request.Subject))
            {
                classes = classes.Where(c => c.Subject.Name.Equals(request.Subject, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            // Apply sorting
            classes = request.SortBy.ToLower() switch
            {
                "name" => request.IsDescending ? classes.OrderByDescending(c => c.Subject.Name).ToList() : classes.OrderBy(c => c.Subject.Name).ToList(),
                "date" => request.IsDescending ? classes.OrderByDescending(c => c.StartDate).ToList() : classes.OrderBy(c => c.StartDate).ToList(),
                _ => classes
            };

            var classesDTO = classes.Select(c => new ClassDTO
            {
                Id = c.Id,
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                TeacherName = c.Teacher.User.Name,
                SubjectName = c.Subject.Name,
                NumberOfStudent = c.StudentClasses.Count(),
            }).ToList();


            // Apply pagination
            int totalRecords = classes.Count();
            var paginatedClasses = classesDTO.Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToList();

            var paginatedResult = new PaginatedResultDTO<ClassDTO>
            {
                Items = paginatedClasses,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalRecords = totalRecords
            };

            return new CommonResult<PaginatedResultDTO<ClassDTO>>
            {
                IsSuccess = true,
                Code = 200,
                Data = paginatedResult
            };
        }

        public async Task<CommonResult<ClassDTO>> GetClassDetailForUser(Guid classId, Guid userId)
        {
            return new CommonResult<ClassDTO>
            {
                IsSuccess = true,
                Code = 200,
                Message = "Success"
            };
        }

    }
}
