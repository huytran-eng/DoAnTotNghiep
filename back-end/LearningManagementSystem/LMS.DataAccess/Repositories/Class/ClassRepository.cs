using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class ClassRepository : BaseRepository<Class>, IClassRepository
    {
        public ClassRepository(AppDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Class>> GetAllAsync()
        {
            return await _context.Classes
               .Include(c => c.Teacher)
               .Include(c => c.Subject)
               .Include(c => c.StudentClasses)
               .Include(c => c.Topics)
               .ToListAsync();
        }

        public async Task<IEnumerable<Class>> GetClassesByTeacherIdAsync(Guid teacherId)
        {
            return await _context.Classes
                .Where(c => c.TeacherId == teacherId)
                .Include(c => c.Teacher)
                .Include(c => c.Subject)
                .Include(c => c.StudentClasses)
                .Include(c => c.Topics)
                .ToListAsync();
        }

        public async Task<IEnumerable<Class>> GetClassesByStudentIdAsync(Guid studentId)
        {
            return await _context.Classes
                .Where(c => c.StudentClasses.Any(s => s.Id == studentId))
                .Include(c => c.Teacher)
                .Include(c => c.Subject)
                .Include(c => c.StudentClasses)
                .Include(c => c.Topics)
                .ToListAsync();
        }

        public override async Task<Class> GetByIdAsync(Guid id)
        {
            return await _context.Classes
                .Include(c => c.Teacher) 
                .Include(c => c.Subject)
                .Include(c => c.StudentClasses)
                .Include(c => c.Topics)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Class>> GetClassesForStudent(Guid studentId)
        {
            return await _context.StudentClasses
              .Where(sc => sc.StudentId == studentId)
              .Select(sc => sc.Class)
              .Include(c => c.Subject)
              .Include(c => c.Teacher)
              .ToListAsync();
        }
    }
}
