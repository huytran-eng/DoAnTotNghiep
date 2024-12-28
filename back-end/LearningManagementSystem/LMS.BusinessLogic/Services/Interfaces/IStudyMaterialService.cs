using LMS.BusinessLogic.DTOs;
using LMS.Core;
using Microsoft.AspNetCore.Http;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IStudyMaterialService
    {
        Task<CommonResult<StudyMaterialDTO>> CreateStudyMaterialAsync(CreateStudyMaterialDTO studyMaterialDTO, IFormFile file, Guid userId);
        Task<CommonResult<List<StudyMaterialListDTO>>> GetStudyMaterialsForSubject(Guid subjectId, Guid userId);
        Task<CommonResult<DownloadStudyMaterialDTO>> DownloadStudyMaterialAsync(Guid studyMaterialId);
        Task<CommonResult<List<ClassStudyMaterialListDTO>>> GetClassStudyMaterials(Guid classId, Guid userId);
        Task<CommonResult<ClassStudyMaterialListDTO>> ToggleStudyMaterialForClass(Guid classId, Guid studyMaterialId, Guid userId);
    }
}
