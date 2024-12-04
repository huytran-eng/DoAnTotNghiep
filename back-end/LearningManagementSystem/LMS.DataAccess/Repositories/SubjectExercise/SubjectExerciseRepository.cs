using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class SubjectExerciseRepository : BaseRepository<SubjectExercise>, ISubjectExerciseRepository
    {
        public SubjectExerciseRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<SubjectExercise>> FindBySubjectAsync(Guid subjectId, Guid exerciseId)
        {
            return await _context.SubjectExercises
                                 .Where(se => se.SubjectId == subjectId && se.ExerciseId == exerciseId)
                                 .Include(se => se.Exercise)
                                 .Include(se => se.Topic)   
                                 .ToListAsync();
        }

        public async Task<IEnumerable<SubjectExercise>> GetSubjectExercisesByTopicIdAsync(Guid topicId)
        {
            return await _context.SubjectExercises
                                 .Where(se => se.TopicId == topicId)
                                 .ToListAsync();
        }
    }
}
