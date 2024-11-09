using Azure.Core;
using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
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

        public ClassService(
              IStudentRepository studentRepository,
              IClassRepository classRepository,
              ITeacherRepository teacherRepository,
              IUserRepository userRepository)
        {
            _studentRepository = studentRepository;
            _classRepository = classRepository;
            _teacherRepository = teacherRepository;
            _userRepository = userRepository;
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

            var subject = await _teacherRepository.GetByIdAsync(createClassRequest.SubjectId);
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
                StudentClasses = new List<StudentClass>()
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
    }
}
