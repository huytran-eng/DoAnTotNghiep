using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class StudentRepository : BaseRepository<Student>, IStudentRepository
    {
        public StudentRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Class>> GetClassesForStudent(Guid studentId)
        {
            return await _context.StudentClasses
              .Where(sc => sc.StudentId == studentId)   
              .Select(sc => sc.Class)     
              .Include(c => c.Subject)
              .Include(c=> c.Teacher)
              .ToListAsync();
        }

    }
}
