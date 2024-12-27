using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface ISubjectRepository : IBaseRepository<Subject>
    {
        Task<IEnumerable<Subject>> GetSubjectsByStudentIdAsync(Guid studentId);
        Task<Subject> GetSubjectByClassIdAsync(Guid classId);

    }
}
