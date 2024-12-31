using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class TeacherRepository : BaseRepository<Teacher>, ITeacherRepository
    {
        public TeacherRepository(AppDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Teacher>> GetAllAsync()
        {
            return await _context.Teachers
               .Include(c => c.User)
               .ToListAsync();
        }

        public override async Task<Teacher> GetByIdAsync(Guid id)
        {
            return await _context.Teachers
                .Include(t => t.User)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Teacher>> GetByDepartmentIdAsync(Guid departmentId)
        {
            return await _context.Teachers
                .Include(t => t.User)
                .Where(t => t.DepartmentId == departmentId)
                .ToListAsync();
        }

    }
}
