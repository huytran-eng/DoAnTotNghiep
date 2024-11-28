using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class ClassExerciseRepository : BaseRepository<ClassExercise>, IClassExerciseRepository
    {
        public ClassExerciseRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<ClassExercise> GetClassExerciseWithTestCasesByIdAsync(Guid classExerciseId)
        {
            return await _context.ClassExercises
                        .Include(ce => ce.SubjectExercise)
                        .ThenInclude(se => se.Exercise)
                        .ThenInclude(e => e.TestCases)
                        .FirstOrDefaultAsync(ce => ce.Id == classExerciseId);
        }

    }
}
