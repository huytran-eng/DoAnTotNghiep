using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.Core;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface ITeacherService
    {
        Task<CommonResult<List<TeacherListDTO>>> GetAllTeachers();
        Task<CommonResult<TeacherDTO>> CreateAsync(CreateTeacherDTO teacherDTO);
        Task<CommonResult<TeacherDetailDTO>> GetTeacherDetail(Guid teacherId);
        Task<CommonResult<List<TeacherListDTO>>> GetTeachersByDepartmentIdAsync(Guid departmentId);
        Task<CommonResult<TeacherDTO>> EditTeacherAsync(Guid teacherId, EditTeacherDTO teacherDTO);
    }
}
