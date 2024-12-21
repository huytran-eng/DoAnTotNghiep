using Azure;
using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class StudentSubmissionService : IStudentSubmissionService
    {
        private readonly IClassExerciseRepository _classExerciseRepository;
        private readonly ISubjectProgrammingLanguageRepository _subjectProgrammingLanguageRepository;
        private readonly IStudentSubmissonRepository _studentSubmissionRepository;
        private readonly IUserRepository _userRepository;


        public StudentSubmissionService(IClassExerciseRepository classExerciseRepository,
                                 ISubjectProgrammingLanguageRepository subjectProgrammingLanguageRepository,
                                 IStudentSubmissonRepository studentSubmissonRepository,
                                  IUserRepository userRepository)
        {
            _classExerciseRepository = classExerciseRepository;
            _subjectProgrammingLanguageRepository = subjectProgrammingLanguageRepository;
            _studentSubmissionRepository = studentSubmissonRepository;
            _userRepository = userRepository;
        }

        public async Task<CommonResult<StudentSubmissionResultDTO>> EvaluateSubmissionAsync(SubmitCodeDTO submissionDTO)
        {
            var classExercise = await _classExerciseRepository.GetClassExerciseWithTestCasesByIdAsync(submissionDTO.ClassExerciseId);
            if (classExercise == null)
                throw new Exception("Exercise not found.");


            var subjectProgrammingLanguage = await _subjectProgrammingLanguageRepository.GetByIdAsync(submissionDTO.SubjectProgrammingLanguageId);

            var exercise = classExercise.SubjectExercise.Exercise;

            var codeExecuteRequest = new CodeExecutionRequest
            {
                Code = submissionDTO.Code,
                Language = subjectProgrammingLanguage.ProgrammingLanguage.Name.ToLower().Trim(),
                TestCases = exercise.TestCases.Select(tc => new TestCasePayload
                {
                    Input = tc.Input,
                    ExpectedOutput = tc.ExpectedOutput
                }).ToList()
            };

            string json = JsonSerializer.Serialize(codeExecuteRequest, new JsonSerializerOptions
            {
                WriteIndented = true // For better readability
            });


            using (var client = new HttpClient())
            {
                try
                {
                    // Configure the HttpClient
                    client.BaseAddress = new Uri("http://36.50.135.228:8080");
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    // Make the POST request to the external service
                    var response = await client.PostAsJsonAsync("api/execute", codeExecuteRequest);

                    // Check if the request was successful
                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadFromJsonAsync<CodeExecutionResponse>();

                        if (result == null)
                        {
                            return new CommonResult<StudentSubmissionResultDTO>
                            {
                                IsSuccess = false,
                                Code = 500, // Internal server error
                                Message = "Failed to deserialize the response from the API."
                            };
                        }
                        var passedTestCases = result.TestCases.Count(r => r.Success);
                        var totalTestCases = result.TestCases.Count;
                        var highestExecutionTimeMs = result.TestCases.Max(tc => tc.ExecutionTime); // in ms
                        var highestMemoryUsageMb = result.TestCases.Max(tc => tc.MemoryUsed);
                        var timeLimitMs = exercise.TimeLimit * 1000; // Convert time limit to ms

                        StudentSubmissionStatus status;
                        if (highestExecutionTimeMs > timeLimitMs)
                        {
                            status = StudentSubmissionStatus.TLE;
                        }
                        else if (!result.IsSuccess)
                        {
                            status = StudentSubmissionStatus.RE;
                        }
                        else
                        {
                            status = passedTestCases == totalTestCases
                                ? StudentSubmissionStatus.AC
                                : StudentSubmissionStatus.WA;
                        }

                        var message = status switch
                        {
                            StudentSubmissionStatus.AC => $"Đã pass toàn bộ {passedTestCases}/{totalTestCases} test case",
                            StudentSubmissionStatus.WA => $"Đã pass {passedTestCases}/{totalTestCases} test case",
                            StudentSubmissionStatus.TLE => "Vượt quá giới hạn thời gian cho phép",
                            StudentSubmissionStatus.RE => result.Message,
                            _ => "Unknown error"
                        };

                        var studentSubmission = new StudentSubmission
                        {
                            Id = Guid.NewGuid(),
                            Status = status,
                            Code = submissionDTO.Code,
                            StudentId = submissionDTO.StudentId.Value,
                            ClassExerciseId = submissionDTO.ClassExerciseId,
                            SubmitDate = DateTime.UtcNow.AddHours(7),
                            ExecutionTime = highestExecutionTimeMs,
                            MemoryUsed = highestMemoryUsageMb,
                            SubjectProgrammingLanguageId = submissionDTO.SubjectProgrammingLanguageId
                        };

                        await _studentSubmissionRepository.AddAsync(studentSubmission);
                        await _studentSubmissionRepository.SaveAsync();
                        return new CommonResult<StudentSubmissionResultDTO>
                        {
                            IsSuccess = true,
                            Code = 200,
                            Message = message,
                            Data = new StudentSubmissionResultDTO
                            {
                                Status = (int)status,
                                Message = message,
                                TestCases = passedTestCases,
                                TotalTestCases = totalTestCases
                            }
                        };
                    }
                    else
                    {
                        // Handle the error case (non-successful response)
                        return new CommonResult<StudentSubmissionResultDTO>
                        {
                            IsSuccess = false,
                            Code = (int)response.StatusCode,
                            Message = "Failed to evaluate the submission.",
                            Data = new StudentSubmissionResultDTO
                            {
                                Status = 3, // Mark as error if the request failed
                                Message = "Failed to connect to the evaluation service",
                            }
                        };
                    }
                }
                catch (Exception ex)
                {
                    // Log the exception (e.g., using a logging framework)
                    return new CommonResult<StudentSubmissionResultDTO>
                    {
                        IsSuccess = false,
                        Code = 500,
                        Message = $"An error occurred: {ex.Message}"
                    };
                }
            }
        }

        public async Task<CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>> GetSubmissionsByClassExerciseAndStudentAsync(Guid classExerciseId, Guid studentId)
        {
            try
            {

                // Fetch submissions from the repository
                var submissions = await _studentSubmissionRepository.GetSubmissionsByExerciseAndStudentAsync(classExerciseId, studentId);

                if (submissions == null || !submissions.Any())
                {
                    return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Not found",
                    };
                }

                // Map submissions to DTOs
                var submissionDtos = submissions.Select(submission => new StudentSubmissionHistoryDTO
                {
                    SubmissionId = submission.Id,
                    ExerciseId = submission.ClassExercise.ExerciseId,
                    StudentId = submission.StudentId,
                    SubmitDate = submission.SubmitDate,
                    ExecutionTime = submission.ExecutionTime,
                    MemoryUsed = submission.MemoryUsed,
                    Status = (int)submission.Status,
                    ProgrammingLanguage = submission.SubjectProgrammingLanguage.ProgrammingLanguage.Name,
                    Code = submission.Code,
                });

                return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = submissionDtos,
                };
            }
            catch (Exception ex)
            {
                // Log exception (not shown for brevity)
                return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = "Server error",
                };
            }
        }

        public async Task<CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>> GetSubmissionsByClassAndStudentAsync(Guid classId, Guid studentId, Guid userId)
        {
            try
            {
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                bool isAllowed = currentUserInfo.Position == PositionEnum.Admin ||
                     currentUserInfo.Position == PositionEnum.Teacher ||
                     studentId == userId;

                // Fetch submissions from the repository for the given classId and studentId
                var submissions = await _studentSubmissionRepository.GetSubmissionsByStudentIdAndClassIdAsync(studentId, classId);

                if (submissions == null || !submissions.Any())
                {
                    return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "No submissions found for the given class and student.",
                    };
                }

                // Map submissions to DTOs
                var submissionDtos = submissions.Select(submission => new StudentSubmissionHistoryDTO
                {
                    SubmissionId = submission.Id,
                    ExerciseId = submission.ClassExercise.ExerciseId,
                    StudentId = submission.StudentId,
                    SubmitDate = submission.SubmitDate,
                    ExecutionTime = submission.ExecutionTime,
                    MemoryUsed = submission.MemoryUsed,
                    Status = (int)submission.Status,
                    ProgrammingLanguage = submission.SubjectProgrammingLanguage.ProgrammingLanguage.Name,
                    Code = isAllowed ? submission.Code : null, 
                });

                return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = submissionDtos,
                };
            }
            catch (Exception ex)
            {
                // Log exception (not shown for brevity)
                return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = "Server error occurred while retrieving submissions.",
                };
            }
        }

        public async Task<CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>> GetStudentSubmissionByStudentId( Guid studentId, Guid userId)
        {
            try
            {
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                bool isAllowed = currentUserInfo.Position == PositionEnum.Admin ||
                      currentUserInfo.Position == PositionEnum.Teacher ||
                      studentId == userId;

                // Fetch submissions from the repository for the given classId and studentId
                var submissions = await _studentSubmissionRepository.GetSubmissionsByStudentIdAsync(studentId);

                if (submissions == null || !submissions.Any())
                {
                    return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "No submissions found for the given class and student.",
                    };
                }

                // Map submissions to DTOs
                var submissionDtos = submissions.Select(submission => new StudentSubmissionHistoryDTO
                {
                    Id = submission.Id,
                    ExerciseId = submission.ClassExercise.ExerciseId,
                    StudentId = submission.StudentId,
                    SubmitDate = submission.SubmitDate,
                    ExecutionTime = submission.ExecutionTime,
                    MemoryUsed = submission.MemoryUsed,
                    Status = (int)submission.Status,
                    ProgrammingLanguage = submission.SubjectProgrammingLanguage.ProgrammingLanguage.Name,
                    Code = isAllowed ? submission.Code : null,
                    ExerciseTitle = submission.ClassExercise.Exercise.Title,
                    SubjectName = submission.ClassExercise.ClassTopicOpen.Class.Subject.Name,
                    ClassName = submission.ClassExercise.ClassTopicOpen.Class.Name
                });

                return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = submissionDtos,
                };
            }
            catch (Exception ex)
            {
                // Log exception (not shown for brevity)
                return new CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = "Server error occurred while retrieving submissions.",
                };
            }
        }
    }
}
