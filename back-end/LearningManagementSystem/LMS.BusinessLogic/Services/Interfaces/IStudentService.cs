using LMS.BusinessLogic.DTOs;
using LMS.Core;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IStudentService
    {
        Task<CommonResult<StudentDTO>> ImportStudents(Stream stream);
    }
}
