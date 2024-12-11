using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.Core;
using LMS.DataAccess.Models;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IStudentSubmissionService
    {
        Task<CommonResult<StudentSubmissionResultDTO>> EvaluateSubmissionAsync(SubmitCodeDTO submissionDTO);
        Task<CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>> GetSubmissionsByClassExerciseAndStudentAsync(Guid exerciseId, Guid studentId);
        Task<CommonResult<IEnumerable<StudentSubmissionHistoryDTO>>> GetSubmissionsByClassAndStudentAsync(Guid classId, Guid studentId, Guid userId);
    }
}
