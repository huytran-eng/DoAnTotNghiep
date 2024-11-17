using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.Core;
using LMS.DataAccess.Models;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IExerciseService
    {
        Task<CommonResult<Exercise>> CreateExerciseAsync(CreateExerciseDTO exerciseDto);
        Task<CommonResult<Exercise>> UpdateExerciseAsync(UpdateExerciseDto updateExerciseDTO);
        Task<CommonResult<Exercise>> AddExerciseToSubjectAsync(AddExerciseToSubjectDto dto);
    }
}
