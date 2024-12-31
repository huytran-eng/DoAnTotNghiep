using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface ITeacherRepository : IBaseRepository<Teacher>
    {
        Task<IEnumerable<Teacher>> GetByDepartmentIdAsync(Guid departmentId);
    }
}
