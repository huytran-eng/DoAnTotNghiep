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
                .OrderByDescending(s => s.SubmitDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<StudentSubmission>> GetSubmissionsByStudentIdAndClassIdAsync(Guid studentId, Guid classId)
        {
            return await _context.StudentSubmissions
              .Include(s => s.ClassExercise)
              .ThenInclude(ce => ce.Exercise)
              .Include(ce => ce.SubjectProgrammingLanguage)
              .ThenInclude(spl => spl.ProgrammingLanguage)
              .Where(s => s.StudentId == studentId && s.ClassExercise.ClassTopicOpen.ClassId == classId)
              .OrderByDescending(s => s.SubmitDate)
              .ToListAsync();
        }

        public async Task<IEnumerable<StudentSubmission>> GetSubmissionsByStudentIdAsync(Guid studentId)
        {
            return await _context.StudentSubmissions
              .Include(s => s.ClassExercise)
                .ThenInclude(ce => ce.Exercise)
              .Include(s => s.ClassExercise)
                .ThenInclude(ce => ce.ClassTopicOpen)
                    .ThenInclude(cto => cto.Class)
                        .ThenInclude(c => c.Subject)
              .Include(ce => ce.SubjectProgrammingLanguage)
                .ThenInclude(spl => spl.ProgrammingLanguage)
              .Where(s => s.StudentId == studentId)
              .OrderByDescending(s => s.SubmitDate)
              .ToListAsync();
        }
    }
}
