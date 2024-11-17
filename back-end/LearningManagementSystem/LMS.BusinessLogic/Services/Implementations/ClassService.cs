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
        private readonly IClassStudyMaterialRepository _classStudyMaterialRepository;



        public ClassService(
              IStudentRepository studentRepository,
              IClassRepository classRepository,
              ITeacherRepository teacherRepository,
              IUserRepository userRepository,
              ISubjectRepository subjectRepository,
              IClassStudyMaterialRepository classStudyMaterialRepository)
        {
            _studentRepository = studentRepository;
            _classRepository = classRepository;
            _teacherRepository = teacherRepository;
            _userRepository = userRepository;
            _subjectRepository = subjectRepository;
            _classStudyMaterialRepository = classStudyMaterialRepository;
        }

        /// <summary>
        /// method to create a new class
        /// </summary>
        /// <param name="createClassRequest"></param>
        /// <returns></returns>
        public async Task<CommonResult<object>> CreateClass(CreateClassDTO createClassRequest)
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
            var foundStudents = await _studentRepository.FindListAsync(s => createClassRequest.StudentIds.Contains(s.Id));

            // Extract the IDs of students that were found
            var foundIds = foundStudents.Select(s => s.Id).ToList();

            // Find IDs from the input list that weren't found in the database
            var notFoundIds = createClassRequest.StudentIds.Except(foundIds).ToList();

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
        public async Task<CommonResult<PaginatedResultDTO<ClassDTO>>> GetClassesForUser(string? subject,
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
                return new CommonResult<PaginatedResultDTO<ClassDTO>>
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
            classes = sortBy.ToLower() switch
            {
                "name" => isDescending ? classes.OrderByDescending(c => c.Subject.Name) : classes.OrderBy(c => c.Subject.Name),
                "date" => isDescending ? classes.OrderByDescending(c => c.StartDate) : classes.OrderBy(c => c.StartDate),
                _ => classes
            };

            // Map to DTOs
            var classesDTO = classes.Select(c => new ClassDTO
            {
                Id = c.Id,
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                TeacherName = c.Teacher.User.Name,
                SubjectName = c.Subject.Name,
                NumberOfStudent = c.StudentClasses.Count()
            }).ToList();

            // Apply pagination
            int totalRecords = classes.Count();
            var paginatedClasses = classesDTO.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            // Prepare the paginated result
            var paginatedResult = new PaginatedResultDTO<ClassDTO>
            {
                Items = paginatedClasses,
                Page = page,
                PageSize = pageSize,
                TotalRecords = totalRecords
            };

            return new CommonResult<PaginatedResultDTO<ClassDTO>>
            {
                IsSuccess = true,
                Code = 200,
                Data = paginatedResult
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
            var currentUserInfo = await _userRepository.GetByIdAsync(userId);
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

            if (currentUserInfo.Position == PositionEnum.Teacher)
            {
                // Check if the teacher teaches the class
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
            // teacher can only access a class they enrolled
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
}
        
        /// <summary>
        /// method to get all students inside a class
        /// </summary>
        /// <param name="classId"></param>
        /// <returns></returns>
        public async Task<CommonResult<List<StudentDTO>>> GetStudentsByClassAsync(Guid classId, Guid userId)
        {
            var students = await _studentRepository.GetStudentsByClassAsync(classId);

            return new CommonResult<List<StudentDTO>>
            {
                IsSuccess = true,
                Data = students.Select(s => new StudentDTO
                {
                    Id = s.Id,
                    StudentIdString = s.StudentIdString,
                    BirthDate = s.User.BirthDate,
                    Name = s.User.Name,
                }).ToList()
            };
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
