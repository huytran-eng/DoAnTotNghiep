using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.Core;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface ITeacherService
    {
        Task<CommonResult<List<TeacherListDTO>>> GetAllTeachers();
        Task<CommonResult<TeacherDTO>> CreateAsync(TeacherDTO teacherDTO);
    }
}
