using LMS.BusinessLogic.DTOs;
using LMS.Core;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IStudentService
    {
        Task<CommonResult<StudentDTO>> ImportStudents(Stream stream);
        Task<CommonResult<IEnumerable<ClassDTO>>> GetClassesForStudent(Guid studentId, string? search, string? sortBy, bool descending);
        Task<CommonResult<List<StudentDTO>>> GetStudentsForAdmin(
           string? studentName,
           string sortBy,
           bool isDescending,
           int page,
           int pageSize,
           Guid userId);
        Task<CommonResult<List<StudentDTO>>> GetStudentsForClass(Guid classId, Guid userId);
    }
}
