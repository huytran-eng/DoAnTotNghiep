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
        //Task<CommonResult<PaginatedResultDTO<ExerciseListDTO>>> GetClassExercises(string? subject,
        //  string sortBy,
        //  bool isDescending,
        //  int page,
        //  int pageSize,
        //  Guid userId);
    }
}
