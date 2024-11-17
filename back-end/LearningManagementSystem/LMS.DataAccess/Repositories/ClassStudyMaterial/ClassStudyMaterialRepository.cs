using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class ClassStudyMaterialRepository : BaseRepository<ClassStudyMaterial>, IClassStudyMaterialRepository
    {
        public ClassStudyMaterialRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<ClassStudyMaterial>> GetByClassIdAsync(Guid classId)
        {
            return await _context.ClassStudyMaterials
                .Where(csm => csm.ClassId == classId)
                .Include(csm => csm.StudyMaterial)
                .ToListAsync();
        }
    }
}
