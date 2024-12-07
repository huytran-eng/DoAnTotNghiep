using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.Core;
using LMS.DataAccess.Models;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IClassService
    {
        Task<CommonResult<object>> CreateClass(CreateClassDTO createClassRequest, Stream stream);

        Task<CommonResult<List<ClassListDTO>>> GetClassesForUser(string? subject,
                                                                                        string sortBy,
                                                                                        bool isDescending,
                                                                                        int page,
                                                                                        int pageSize,
                                                                                        Guid userId);
        Task<CommonResult<ClassDTO>> GetClassDetailForUser(Guid classId, Guid userId);

        Task<CommonResult<List<ClassStudyMaterialDTO>>> GetStudyMaterialsForClassAsync(Guid classId, Guid userId);

        Task<CommonResult<List<ClassListDTO>>> GetClassesForSubject(Guid subjectId, Guid userId);
        Task<CommonResult<ClassTopicOpenDTO>> OpenClassTopicAsync(OpenClassTopicDTO openClassTopicDTO, Guid userId);

        Task<CommonResult<List<ClassTopicOpenListDTO>>> GetOpenClassTopicAsync(Guid classId, Guid userId);
        Task<CommonResult<List<TopicDTO>>> GetAvailableClassTopicAsync(Guid classId, Guid userId);

    }
}
