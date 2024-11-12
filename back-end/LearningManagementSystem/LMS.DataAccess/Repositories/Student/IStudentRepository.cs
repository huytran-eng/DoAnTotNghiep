using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface IStudentRepository : IBaseRepository<Student>
    {
        Task<IEnumerable<Class>> GetClassesForStudent(Guid studentId);
    }
}
