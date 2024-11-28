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

    }
}
