using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface IStudentRepository : IBaseRepository<Student>
    {
        Task<IEnumerable<Student>> GetStudentsByClassAsync(Guid classId);
    }
}
