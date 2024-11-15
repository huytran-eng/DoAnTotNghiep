using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public  interface IClassRepository: IBaseRepository<Class>
    {
        Task<List<Class>> GetAllAsync();
        Task<List<Class>> GetByTeacherIdAsync(Guid teacherId);
        Task<List<Class>> GetByStudentIdAsync(Guid studentId);
    }
}
