using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class ExerciseRepository : BaseRepository<Exercise>, IExerciseRepository
    {
        public ExerciseRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Exercise> GetByIdWithTestCasesAsync(Guid Id)
        {
            return await _context.Exercises
                .Include(c => c.TestCases)
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<Exercise> GetExerciseWithTestCasesByClassExerciseIdAsync(Guid classExerciseId)
        {
            return await _context.ClassExercises
                .Where(ce => ce.Id == classExerciseId)
                .Select(ce => ce.SubjectExercise.Exercise)
                .Include(e => e.TestCases)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<SubjectExercise>> GetBySubjectIdAsync(Guid subjectId)
        {
            return await _context.SubjectExercises
                                        .Where(se => se.SubjectId == subjectId)
                                        .Include(se => se.Exercise)  // Include the Exercise related to SubjectExercise
                                        .Include(se => se.Topic)     // Include the Topic related to SubjectExercise
                                        .ToListAsync();

        }

    }
}
