using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public class StudentRepository : BaseRepository<Student>, IStudentRepository
    {
        public StudentRepository(AppDbContext context) : base(context)
        {
        }
    }
}
