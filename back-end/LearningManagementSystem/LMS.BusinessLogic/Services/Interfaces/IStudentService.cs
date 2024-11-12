using LMS.BusinessLogic.DTOs;
using LMS.Core;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IStudentService
    {
        Task<CommonResult<StudentDTO>> ImportStudents(Stream stream);
        Task<CommonResult<IEnumerable<ClassDTO>>> GetClassesForStudent(Guid studentId, string? search, string? sortBy, bool descending);

    }
}
