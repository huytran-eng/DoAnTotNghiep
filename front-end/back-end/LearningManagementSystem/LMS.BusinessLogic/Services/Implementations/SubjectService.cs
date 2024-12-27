using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class SubjectService : ISubjectService
    {
        private readonly IUserRepository _userRepository;
        private readonly ISubjectRepository _subjectRepository;
        private readonly ITeacherRepository _teacherRepository;
        private readonly IClassRepository _classRepository;
        private readonly IExerciseRepository _exerciseRepository;
        private readonly ITopicRepository _topicRepository;
        private readonly IProgrammingLanguageRepository _programmingLanguageRepository;
        private readonly ISubjectProgrammingLanguageRepository _subjectProgrammingLanguageRepository;



        public SubjectService(
              IUserRepository userRepository,
              ISubjectRepository subjectRepository,
              ITeacherRepository teacherRepository,
              IClassRepository classRepository,
              IExerciseRepository exerciseRepository,
              ITopicRepository topicRepository,
              IProgrammingLanguageRepository programmingLanguageRepository,
              ISubjectProgrammingLanguageRepository subjectProgrammingLanguageRepository
            )
        {
            _userRepository = userRepository;
            _subjectRepository = subjectRepository;
            _teacherRepository = teacherRepository;
            _classRepository = classRepository;
            _exerciseRepository = exerciseRepository;
            _topicRepository = topicRepository;
            _programmingLanguageRepository = programmingLanguageRepository;
            _subjectProgrammingLanguageRepository = subjectProgrammingLanguageRepository;

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
                DepartmentId = subject.DepartmentId,
                NumberOfClasses = subject.Classes.Count,
                Description = subject.Description,
                Topics = subject.Topics.Select(t => new TopicDTO
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                }).ToList(),
                subjectProgrammingLanguageDTOs = subject.SubjectProgrammingLanguages.Select(spl => new SubjectProgrammingLanguageDTO
                {
                    Id = spl.Id,
                    ProgrammingLanguageId = spl.ProgrammingLanguageId
                }).ToList()
            };

            return new CommonResult<SubjectDetailDTO>
            {
                IsSuccess = true,
                Data = subjectDetailDto
            };
        }

        public async Task<CommonResult<SubjectDTO>> CreateSubjectAsync(CreateSubjectDTO dto, Guid userId)
        {
            try
            {
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<SubjectDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                var subject = new Subject
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name,
                    Description = dto.Description,
                    Credit = dto.Credit,
                    DepartmentId = dto.DepartmentId,
                    CreatedAt = DateTime.UtcNow,
                    CreatedById = userId,
                };
                await _subjectRepository.AddAsync(subject);
                var topics = new List<Topic>();
                if (dto.Topics != null && dto.Topics.Any())
                {
                    foreach (var topicDTO in dto.Topics)
                    {
                        var topic = new Topic
                        {
                            Name = topicDTO.Name,
                            Description = topicDTO.Description,
                            SubjectId = subject.Id,
                            CreatedAt = DateTime.UtcNow,
                            CreatedById = userId,
                        };
                        topics.Add(topic);
                    }
                }

                await _topicRepository.AddRangeAsync(topics);
                if (dto.ProgrammingLanguageIds != null && dto.ProgrammingLanguageIds.Any())
                {
                    var programmingLanguageIds = dto.ProgrammingLanguageIds.ToList();
                    var existingProgrammingLanguages = await _programmingLanguageRepository.FindListAsync(pl => programmingLanguageIds.Contains(pl.Id));


                    // If the number of existing programming languages doesn't match the requested IDs, throw an exception
                    if (existingProgrammingLanguages.Count() != programmingLanguageIds.Count)
                    {
                        return new CommonResult<SubjectDTO>
                        {
                            IsSuccess = false,
                            Code = 404,
                            Message = "One or more programming language IDs do not exist."
                        };
                    }

                    var subjectProgrammingLanguages = new List<SubjectProgrammingLanguage>();

                    // Create the SubjectProgrammingLanguage relationships
                    foreach (var programmingLanguageId in dto.ProgrammingLanguageIds)
                    {
                        var subjectProgrammingLanguage = new SubjectProgrammingLanguage
                        {
                            Subject = subject,
                            ProgrammingLanguageId = programmingLanguageId,
                            CreatedAt = DateTime.UtcNow,
                            CreatedById = userId,
                        };
                        subjectProgrammingLanguages.Add(subjectProgrammingLanguage);
                    }

                   await _subjectProgrammingLanguageRepository.AddRangeAsync(subjectProgrammingLanguages);

                }

               await _subjectRepository.SaveAsync();
                return new CommonResult<SubjectDTO>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message ="Success"
                };
            }
            catch (Exception ex)
            {
                return new CommonResult<SubjectDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when creating subject {ex}"
                };
            }
        }

        public async Task<CommonResult<SubjectDTO>> EditSubjectAsync(Guid subjectId, EditSubjectDTO dto, Guid userId)
        {
            try
            {
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<SubjectDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                var subject = await _subjectRepository.GetByIdAsync(subjectId);
                if (subject == null)
                {
                    return new CommonResult<SubjectDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Subject not found."
                    };
                }

                // Update subject fields
                subject.Name = dto.Name ?? subject.Name;
                subject.Description = dto.Description ?? subject.Description;
                subject.Credit = dto.Credit;
                subject.DepartmentId = dto.DepartmentId;
                subject.UpdatedAt = DateTime.UtcNow.AddHours(7);
                subject.UpdatedById = userId;

                await _topicRepository.DeleteRangeAsync(subject.Topics.ToList());

                // Update topics
                if (dto.Topics != null && dto.Topics.Any())
                {

                    var updatedTopics = dto.Topics.Select(topicDTO => new Topic
                    {
                        Name = topicDTO.Name,
                        Description = topicDTO.Description,
                        SubjectId = subjectId,
                        CreatedAt = DateTime.UtcNow.AddHours(7),
                        CreatedById = userId
                    }).ToList();

                    await _topicRepository.AddRangeAsync(updatedTopics);
                }

                await _subjectProgrammingLanguageRepository.DeleteRangeAsync(subject.SubjectProgrammingLanguages.ToList());


                // Update programming languages
                if (dto.ProgrammingLanguageIds != null && dto.ProgrammingLanguageIds.Any())
                {
                    var newRelations = dto.ProgrammingLanguageIds.Select(programmingLanguageId => new SubjectProgrammingLanguage
                    {
                        SubjectId = subjectId,
                        ProgrammingLanguageId = programmingLanguageId,
                        CreatedAt = DateTime.UtcNow,
                        CreatedById = userId
                    }).ToList();

                    await _subjectProgrammingLanguageRepository.AddRangeAsync(newRelations);
                }

                await _subjectRepository.SaveAsync();
                return new CommonResult<SubjectDTO>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = "Subject updated successfully."
                };
            }
            catch (Exception ex)
            {
                return new CommonResult<SubjectDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when editing subject: {ex.Message}"
                };
            }
        }

    }
}
