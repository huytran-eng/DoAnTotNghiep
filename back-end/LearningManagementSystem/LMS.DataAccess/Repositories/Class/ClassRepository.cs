using Azure.Core;
using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class ClassRepository : BaseRepository<Class>, IClassRepository
    {
        public ClassRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<Class>> GetAllAsync(ViewClassRequestDTO request)
        {
            return await _context.Classes
               .Include(c => c.Teacher)
               .Include(c => c.Subject)
               .Include(c => c.StudentClasses)
               .ToListAsync();
        }

        public async Task<List<Class>> GetByTeacherIdAsync(Guid teacherId)
        {
            return await _context.Classes
                .Where(c => c.TeacherId == teacherId)
                .Include(c => c.Teacher)
                .Include(c => c.Subject)
                .Include(c => c.StudentClasses)
                .ToListAsync();
        }

        public async Task<List<Class>> GetByStudentIdAsync(Guid studentId)
        {
            return await _context.Classes
                .Where(c => c.StudentClasses.Any(s => s.Id == studentId))
                .Include(c => c.Teacher)
                .Include(c => c.Subject)
                .Include(c => c.StudentClasses)
                .ToListAsync();
        }
    }
}
