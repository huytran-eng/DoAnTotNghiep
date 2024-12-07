using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.Core;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface ISubjectService
    {
        Task<CommonResult<List<SubjectListDTO>>> GetSubjectsForUser(string? subject,
                string sortBy,
                bool isDescending,
                int page,
                int pageSize,
                Guid userId);

        Task<CommonResult<SubjectDetailDTO>> GetSubjectDetailForUser(Guid subjectId, Guid userId);
        Task<CommonResult<SubjectDTO>> CreateSubjectAsync(CreateSubjectDTO dto, Guid userId);
    }
}
