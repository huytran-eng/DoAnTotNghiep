using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class SubmissionService : ISubmissionService
    {
        private readonly IClassExerciseRepository _classExerciseRepository;
        private readonly ISubjectProgrammingLanguageRepository _subjectProgrammingLanguageRepository;


        public SubmissionService(IClassExerciseRepository classExerciseRepository, ISubjectProgrammingLanguageRepository subjectProgrammingLanguageRepository)
        {
            _classExerciseRepository = classExerciseRepository;
            _subjectProgrammingLanguageRepository = subjectProgrammingLanguageRepository;
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
                    client.BaseAddress = new Uri("http://localhost:8080");
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

                        // Check if all test cases passed
                        var passedTestCases = result.TestCases.Count(r => r.Success);
                        var totalTestCases = result.TestCases.Count;
                        var status = passedTestCases == totalTestCases ? 0 : (result.TestCases.Any(r => r.Success == false) ? 1 : 2);
                        var message = result.Message ?? "No message from the execution service";

                        return new CommonResult<StudentSubmissionResultDTO>
                        {
                            IsSuccess = true, // Success if all test cases pass
                            Code = 200, // Status code for success, failure, or error
                            Message = message,
                            Data = new StudentSubmissionResultDTO
                            {
                                Status = status,
                                Message = message,
                                TestCases = status == 2 ? 0 : passedTestCases // 0 if there's an error in execution, else count passed test cases
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
                                TestCases = 0
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
            //var testCaseResults = new List<TestCaseResult>();

            //foreach (var testCase in exercise.TestCases)
            //{
            //    var actualOutput = await ExecuteUserCodeAsync(submission.UserCode, testCase.Input);

            //    testCaseResults.Add(new TestCaseResult
            //    {
            //        Input = testCase.Input,
            //        ExpectedOutput = testCase.ExpectedOutput,
            //        ActualOutput = actualOutput,
            //        Passed = actualOutput == testCase.ExpectedOutput
            //    });
            //}

            //return new SubmissionResult
            //{
            //    ExerciseId = exercise.Id,
            //    IsSuccessful = testCaseResults.All(t => t.Passed),
            //    TestCaseResults = testCaseResults
            //};
        }

        //private async Task<string> ExecuteUserCodeAsync(string userCode, string input)
        //{
        //    // Add actual code execution logic here
        //    await Task.Delay(100);
        //    return "PlaceholderOutput"; // Replace with actual execution result
        //}
    }
}
