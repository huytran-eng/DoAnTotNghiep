using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using Microsoft.Extensions.Internal;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class ExerciseService : IExerciseService
    {
        private readonly IExerciseRepository _exerciseRepository;
        private readonly ITestCaseRepository _testCaseRepository;
        private readonly ISubjectRepository _subjectRepository;
        private readonly ITopicRepository _topicRepository;
        private readonly ISubjectExerciseRepository _subjectExerciseRepository;
        public ExerciseService(IExerciseRepository exerciseRepository, ITestCaseRepository testCaseRepository, ISubjectRepository subjectRepository, ITopicRepository topicRepository, ISubjectExerciseRepository subjectExerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
            _testCaseRepository = testCaseRepository;
            _subjectRepository = subjectRepository;
            _topicRepository = topicRepository;
            _subjectExerciseRepository = subjectExerciseRepository;
        }

        public async Task<CommonResult<Exercise>> CreateExerciseAsync(CreateExerciseDTO exerciseDto)
        {
            if (exerciseDto == null)
                throw new ArgumentNullException(nameof(exerciseDto));

            try
            {
                var exercise = new Exercise
                {
                    Title = exerciseDto.Title,
                    Description = exerciseDto.Description,
                    Requirements = exerciseDto.Requirements,
                    Difficulty = exerciseDto.Difficulty,
                    TimeLimit = exerciseDto.TimeLimit,
                    SpaceLimit = exerciseDto.SpaceLimit,
                    CreatedAt = DateTime.Now,
                    CreatedById = exerciseDto.CurrentUserId.Value,
                    TestCases = exerciseDto.TestCases.Select(tc => new TestCase
                    {
                        Input = tc.Input,
                        ExpectedOutput = tc.ExpectedOutput,
                        Description = tc.Description,
                        IsHidden = tc.IsHidden,
                        CreatedAt = DateTime.Now,
                        CreatedById = exerciseDto.CurrentUserId.Value
                    }).ToList()
                };


                await _exerciseRepository.AddAsync(exercise);
                await _exerciseRepository.SaveAsync();

                return new CommonResult<Exercise>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = "Create exercise successful",
                };
            }
            catch (Exception ex)
            {
                return new CommonResult<Exercise>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when creating new exercise {ex.Message}",
                };
            }
        }

        public async Task<CommonResult<Exercise>> UpdateExerciseAsync(UpdateExerciseDto updateExerciseDTO)
        {
            if (updateExerciseDTO == null)
                throw new ArgumentNullException(nameof(updateExerciseDTO));

            try
            {
                var existingExercise = await _exerciseRepository.GetByIdWithTestCasesAsync(updateExerciseDTO.Id);
                if (existingExercise == null)
                {
                    return new CommonResult<Exercise>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Exercise not found"
                    };
                }

                // Update Exercise properties
                existingExercise.Title = updateExerciseDTO.Title;
                existingExercise.Description = updateExerciseDTO.Description;
                existingExercise.Requirements = updateExerciseDTO.Requirements;
                existingExercise.Difficulty = updateExerciseDTO.Difficulty;
                existingExercise.TimeLimit = updateExerciseDTO.TimeLimit;
                existingExercise.SpaceLimit = updateExerciseDTO.SpaceLimit;
                existingExercise.UpdatedAt = DateTime.Now;
                existingExercise.UpdatedById = updateExerciseDTO.CurrentUserId;

                // Add new TestCases to the Exercise
                if (updateExerciseDTO.NewTestCases != null && updateExerciseDTO.NewTestCases.Any())
                {
                    foreach (var testCaseDTO in updateExerciseDTO.NewTestCases)
                    {
                        var newTestCase = new TestCase
                        {
                            Input = testCaseDTO.Input,
                            ExpectedOutput = testCaseDTO.ExpectedOutput,
                            Description = testCaseDTO.Description,
                            IsHidden = testCaseDTO.IsHidden,
                            ExerciseId = existingExercise.Id,
                            CreatedAt = DateTime.Now,
                            CreatedById = updateExerciseDTO.CurrentUserId.Value
                        };

                        existingExercise.TestCases.Add(newTestCase);
                    }
                }

                // Update the Exercise in the repository
                await _exerciseRepository.UpdateAsync(existingExercise);
                await _exerciseRepository.SaveAsync();

                return new CommonResult<Exercise>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = "Exercise updated successfully",
                    Data = existingExercise
                };
            }
            catch (Exception ex)
            {
                return new CommonResult<Exercise>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error updating exercise: {ex.Message}"
                };
            }
        }

        public async Task<CommonResult<Exercise>> AddExerciseToSubjectAsync(AddExerciseToSubjectDTO addExercuseToSubjectDTO)
        {
            if (addExercuseToSubjectDTO == null)
                throw new ArgumentNullException(nameof(addExercuseToSubjectDTO));

            try
            {
                // Validate subject
                var subject = await _subjectRepository.GetByIdAsync(addExercuseToSubjectDTO.SubjectId);
                if (subject == null)
                    return new CommonResult<Exercise> { IsSuccess = false, Code = 404, Message = "Subject not found" };

                // Validate exercise
                var exercise = await _exerciseRepository.GetByIdAsync(addExercuseToSubjectDTO.ExerciseId);
                if (exercise == null)
                    return new CommonResult<Exercise> { IsSuccess = false, Code = 404, Message = "Exercise not found" };

                // Validate topic if provided
                var topic = await _topicRepository.GetByIdAsync(addExercuseToSubjectDTO.TopicId);
                if (topic == null || topic.SubjectId != addExercuseToSubjectDTO.SubjectId)
                    return new CommonResult<Exercise> { IsSuccess = false, Code = 400, Message = "Invalid topic for the subject" };

                // Check if the relationship already exists
                var existingRelation = await _subjectExerciseRepository.FindBySubjectAsync(addExercuseToSubjectDTO.SubjectId);
                if (existingRelation != null && existingRelation.Count > 0)
                    return new CommonResult<Exercise> { IsSuccess = false, Code = 400, Message = "Exercise already added to the subject" };

                // Add the relationship
                var subjectExercise = new SubjectExercise
                {
                    SubjectId = addExercuseToSubjectDTO.SubjectId,
                    ExerciseId = addExercuseToSubjectDTO.ExerciseId,
                    TopicId = addExercuseToSubjectDTO.TopicId,
                    AddedDate = DateTime.Now,
                };

                await _subjectExerciseRepository.AddAsync(subjectExercise);
                await _subjectExerciseRepository.SaveAsync();

                return new CommonResult<Exercise> { IsSuccess = true, Code = 200, Message = "Exercise added to subject successfully" };
            }
            catch (Exception ex)
            {
                return new CommonResult<Exercise> { IsSuccess = false, Code = 500, Message = $"Error: {ex.Message}" };
            }
        }

    }
}
