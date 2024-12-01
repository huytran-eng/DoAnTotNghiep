using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class SubjectService : ISubjectService
    {
        private readonly IUserRepository _userRepository;
        private readonly ISubjectRepository _subjectRepository;
        private readonly ITeacherRepository _teacherRepository;
        private readonly IClassRepository _classRepository;
        private readonly IExerciseRepository _exerciseRepository;


        public SubjectService(
              IUserRepository userRepository,
              ISubjectRepository subjectRepository,
              ITeacherRepository teacherRepository,
              IClassRepository classRepository,
              IExerciseRepository exerciseRepository

            )
        {
            _userRepository = userRepository;
            _subjectRepository = subjectRepository;
            _teacherRepository = teacherRepository;
            _classRepository = classRepository;
            _exerciseRepository = exerciseRepository;
        }

        public async Task<CommonResult<List<SubjectListDTO>>> GetSubjectsForUser(
                string? subjectName,
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
                    return new CommonResult<List<SubjectListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                // Retrieve subjects based on user position
                IEnumerable<Subject> subjects;

                if (currentUserInfo.Position == PositionEnum.Admin || currentUserInfo.Position == PositionEnum.Teacher)
                {
                    subjects = await _subjectRepository.GetAllAsync();
                }
                else
                {
                    // Students can see subjects they are enrolled in
                    subjects = await _subjectRepository.GetSubjectsByStudentIdAsync(userId);
                }

                // Apply filtering by subject name if specified
                if (!string.IsNullOrEmpty(subjectName))
                {
                    subjects = subjects.Where(s => s.Name.Equals(subjectName, StringComparison.OrdinalIgnoreCase));
                }

                var subjectListDTO = subjects.Select(s => new SubjectListDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Credit = s.Credit,
                    NumberOfClasses = s.Classes.Count,
                    DepartmentName = s.Department.Name
                }).ToList();

                return new CommonResult<List<SubjectListDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = subjectListDTO
                };


            }
            catch (Exception e)
            {
                return new CommonResult<List<SubjectListDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when getting subject lists {e}"
                };
            }
        }


        public async Task<CommonResult<SubjectDetailDTO>> GetSubjectDetailForUser(Guid subjectId, Guid userId)
        {
            // You can add any additional logic here to check if the user has access to the subject
            var subject = await _subjectRepository.GetByIdAsync(subjectId);

            if (subject == null)
            {
                return new CommonResult<SubjectDetailDTO>
                {
                    IsSuccess = false,
                    Message = "Subject not found"
                };
            }

            // Map the subject entity to the DTO
            var subjectDetailDto = new SubjectDetailDTO
            {
                Id = subject.Id,
                Name = subject.Name,
                Credit = subject.Credit,
                DepartmentName = subject.Department.Name,
                NumberOfClasses = subject.Classes.Count,
                Description = subject.Description,
                Topics = subject.Topics.Select(t => new TopicDTO
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                }).ToList()
            };

            return new CommonResult<SubjectDetailDTO>
            {
                IsSuccess = true,
                Data = subjectDetailDto
            };
        }

        
    }
}
