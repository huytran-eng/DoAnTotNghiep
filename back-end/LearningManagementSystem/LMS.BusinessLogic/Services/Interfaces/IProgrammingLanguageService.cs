using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.Core;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IProgrammingLanguageService
    {
        Task<CommonResult<List<SubjectProgrammingLanguageDTO>>> GetSubjectProgrammingLanguages(Guid subjectId);
        Task<CommonResult<List<SubjectProgrammingLanguageDTO>>> GetClassProgrammingLanguages(Guid classId);

    }
}
