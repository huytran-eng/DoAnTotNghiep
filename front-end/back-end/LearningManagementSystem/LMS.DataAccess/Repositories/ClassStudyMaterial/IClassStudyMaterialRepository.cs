using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface IClassStudyMaterialRepository : IBaseRepository<ClassStudyMaterial>
    {
        Task<List<ClassStudyMaterial>> GetByClassIdAsync(Guid classId);
    }
}
