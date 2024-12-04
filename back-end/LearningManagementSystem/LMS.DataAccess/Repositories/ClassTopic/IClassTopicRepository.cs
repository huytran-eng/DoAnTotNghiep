using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface IClassTopicRepository : IBaseRepository<ClassTopicOpen>
    {
        Task<ClassTopicOpen> GetActiveClassTopicAsync(Guid classId, Guid topicId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<ClassTopicOpen>> GetAllClassTopicAsync(Guid classId);
    }
}
