using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class StudentRepository : BaseRepository<Student>, IStudentRepository
    {
        public StudentRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Student>> GetStudentsByClassAsync(Guid classId)
        {
            return await _context.StudentClasses
                .Where(sc => sc.ClassId == classId)
                .Select(sc => sc.Student)
                .Include(student => student.User)
                .ToListAsync();
        }
    }
}
  