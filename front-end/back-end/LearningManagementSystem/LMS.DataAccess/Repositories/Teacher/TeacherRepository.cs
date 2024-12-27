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
    }
}
