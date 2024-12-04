using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.Core;
using LMS.DataAccess.Models;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IExerciseService
    {
        Task<CommonResult<Exercise>> CreateExerciseAsync(CreateExerciseDTO exerciseDto);
        Task<CommonResult<Exercise>> UpdateExerciseAsync(UpdateExerciseDto updateExerciseDTO);
        Task<CommonResult<Exercise>> AddExerciseToSubjectAsync(AddExerciseToSubjectDTO dto);
        Task<CommonResult<List<ExerciseListDTO>>> GetExercisesForUser(Guid userId);

        Task<CommonResult<ExerciseDTO>> GetExerciseDetail(Guid exerciseId, Guid userId);
        Task<CommonResult<List<SubjectExerciseListDTO>>> GetExerciseForSubject(Guid subjectId, Guid userId);
        Task<CommonResult<ClassExerciseDTO>> GetClassExerciseForStudent(Guid classExerciseId, Guid userId);



    }
}
