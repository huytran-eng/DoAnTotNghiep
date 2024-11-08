using LMS.BusinessLogic.DTOs;
using LMS.Core;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface ITeacherService
    {
        Task<CommonResult<TeacherDTO>> CreateAsync(TeacherDTO teacherDTO);
    }
}
