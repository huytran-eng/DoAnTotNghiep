using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public class StudentSubmissionRepository : BaseRepository<StudentSubmission>, IStudentSubmissonRepository
    {
        public StudentSubmissionRepository(AppDbContext context) : base(context)
        {
        }
    }
}
