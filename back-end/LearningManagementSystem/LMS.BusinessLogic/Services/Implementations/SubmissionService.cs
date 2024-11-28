using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;

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

        public async Task<CommonResult<StudentSubmission>> EvaluateSubmissionAsync(ExerciseSubmissionDTO submissionDTO)
        {
            var classExercise = await _classExerciseRepository.GetClassExerciseWithTestCasesByIdAsync(submissionDTO.ClassExerciseId);
            if (classExercise == null)
                throw new Exception("Exercise not found.");


            var exercise = classExercise.SubjectExercise.Exercise;

            var subjectProgrammingLanguage = await _subjectProgrammingLanguageRepository.FindAsync(
                    spl => spl.SubjectId == classExercise.SubjectExercise.SubjectId &&
                       spl.ProgrammingLanguage.Name.Equals(submissionDTO.ProgrammingLanguage));

            if (subjectProgrammingLanguage == null)
                throw new Exception($"The programming language '{submissionDTO.ProgrammingLanguage}' is not allowed for this subject.");

            var codeExecuteRequest = new CodeExecutionRequest
            {
                Code = submissionDTO.StudentCode,
                ProgrammingLanguage = subjectProgrammingLanguage.ProgrammingLanguage.Name,
                TestCases = exercise.TestCases.Select(tc => new TestCasePayload
                {
                    Input = tc.Input,
                    ExpectedOutput = tc.ExpectedOutput
                }).ToList()
            };

            return new CommonResult<StudentSubmission>
            {
                IsSuccess = false,
                Code = 404,
                Message = "No class found"
            };
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
