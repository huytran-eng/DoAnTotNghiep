using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.Core;
using LMS.DataAccess.Models;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface ISubmissionService
    {
        Task<CommonResult<StudentSubmission>> EvaluateSubmissionAsync(ExerciseSubmissionDTO submissionDTO);
    }
}
