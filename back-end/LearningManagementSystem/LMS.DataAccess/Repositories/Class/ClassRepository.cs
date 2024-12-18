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
                .Where(c => c.IsDeleted == false && c.Subject.IsDeleted == false)
               .Include(c => c.Teacher)
               .ThenInclude(t => t.User)
               .Include(c => c.Subject)
               .Include(c => c.StudentClasses)
               .Include(c => c.Topics.Where(t => t.IsDeleted == false))
               .ToListAsync();
        }

        public async Task<IEnumerable<Class>> GetClassesByTeacherIdAsync(Guid teacherId)
        {
            return await _context.Classes
                .Where(c => c.TeacherId == teacherId)
                .Include(c => c.Teacher)
                .ThenInclude(t => t.User)
                .Include(c => c.Subject)
                .ThenInclude(s => s.Department)
                .Include(c => c.StudentClasses)
                .Include(c => c.Topics)
                .ToListAsync();
        }

        public async Task<IEnumerable<Class>> GetClassesByStudentIdAsync(Guid studentId)
        {
            return await _context.Classes
                .Where(c => c.StudentClasses.Any(s => s.StudentId == studentId))
                .Include(c => c.Teacher)
                .ThenInclude(t => t.User)
                .Include(c => c.Subject)
                .Include(c => c.StudentClasses)
                .Include(c => c.Topics)
                .ToListAsync();
        }

        public override async Task<Class> GetByIdAsync(Guid id)
        {
            return await _context.Classes
                .Include(c => c.Teacher)
                .ThenInclude(t => t.User)
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
        public async Task<IEnumerable<Class>> GetBySubjectIdAsync(Guid subjectId)
        {
            return await _context.Classes
              .Where(sc => sc.SubjectId == subjectId)
              .Include(c => c.Subject)
              .Include(c => c.StudentClasses)
              .Include(c => c.Teacher)
              .ThenInclude(t => t.User)
              .ToListAsync();
        }
    }
}
