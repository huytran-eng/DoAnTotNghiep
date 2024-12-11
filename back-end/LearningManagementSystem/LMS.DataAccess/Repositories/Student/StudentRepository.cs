using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class StudentRepository : BaseRepository<Student>, IStudentRepository
    {
        public StudentRepository(AppDbContext context) : base(context)
        {
        }
        public override async Task<Student> GetByIdAsync(Guid id)
        {
            return await _context.Students.Include(student => student.User).FirstOrDefaultAsync(student => student.Id == id); ;
        }
        public override async Task<IEnumerable<Student>> GetAllAsync()
        {
            return await _context.Students.Include(student => student.User).ToListAsync();
        }
        public async Task<IEnumerable<Student>> GetStudentsByClassAsync(Guid classId)
        {
            return await _context.StudentClasses
                .Where(sc => sc.ClassId == classId)
                .Include(sc => sc.Student.User) 
                .Select(sc => sc.Student)
                .ToListAsync();
        }



    }
}
