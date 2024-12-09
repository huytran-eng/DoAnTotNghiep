using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class StudentSubmissionRepository : BaseRepository<StudentSubmission>, IStudentSubmissonRepository
    {
        public StudentSubmissionRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<StudentSubmission>> GetSubmissionsByExerciseAndStudentAsync(Guid classExerciseId, Guid studentId)
        {
            return await _context.StudentSubmissions
                .Include(s => s.ClassExercise)
                .ThenInclude(ce => ce.Exercise)
                .Include(ce => ce.SubjectProgrammingLanguage)
                .ThenInclude(spl => spl.ProgrammingLanguage)
                .Where(s => s.ClassExerciseId == classExerciseId && s.StudentId == studentId)
                .ToListAsync();
        }
    }
}
