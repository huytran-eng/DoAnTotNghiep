using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class ClassTopicRepository : BaseRepository<ClassTopicOpen>, IClassTopicRepository
    {
        public ClassTopicRepository(AppDbContext context) : base(context)
        {
        }

        // Method to get an active class-topic entry by ClassId, TopicId, and date range
        public async Task<ClassTopicOpen> GetActiveClassTopicAsync(Guid classId, Guid topicId, DateTime startDate, DateTime endDate)
        {
            // Query to find if there is an active ClassTopicOpen with overlapping timeframes
            return await _context.ClassTopicOpens
                                 .Where(cto => cto.ClassId == classId
                                               && cto.TopicId == topicId
                                               && (
                                                    (cto.StartDate <= endDate && cto.EndDate >= startDate) // Check if the time periods overlap
                                                 )
                                 )
                                 .FirstOrDefaultAsync();  
        }

        public async Task<IEnumerable<ClassTopicOpen>> GetAllClassTopicAsync(Guid classId)
        {
            return await _context.ClassTopicOpens
                                 .Where(cto => cto.ClassId == classId
                                 )
                                 .Include(cto => cto.Class)
                                 .Include(cto => cto.Topic)
                                 .Include (cto => cto.ClassExercises)
                                 .ThenInclude(ce => ce.SubjectExercise)
                                 .ThenInclude(se => se.Exercise)
                                 .ToListAsync();
        }
    }
}
