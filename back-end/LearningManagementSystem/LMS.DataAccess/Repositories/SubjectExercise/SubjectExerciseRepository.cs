using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class SubjectExerciseRepository : BaseRepository<SubjectExercise>, ISubjectExerciseRepository
    {
        public SubjectExerciseRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<SubjectExercise>> FindBySubjectAsync(Guid subjectId)
        {
            return await _context.SubjectExercises
                                 .Where(se => se.SubjectId == subjectId)
                                 .Include(se => se.Exercise)
                                 .Include(se => se.Topic)   
                                 .ToListAsync();
        }
    }
}
