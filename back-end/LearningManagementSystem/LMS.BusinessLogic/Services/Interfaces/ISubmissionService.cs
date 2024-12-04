using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.Core;
using LMS.DataAccess.Models;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface ISubmissionService
    {
        Task<CommonResult<StudentSubmissionResultDTO>> EvaluateSubmissionAsync(SubmitCodeDTO submissionDTO);
    }
}
