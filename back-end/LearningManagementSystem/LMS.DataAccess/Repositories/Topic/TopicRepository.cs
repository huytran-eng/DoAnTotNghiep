using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public class TopicRepository : BaseRepository<Topic>, ITopicRepository
    {
        public TopicRepository(AppDbContext context) : base(context)
        {
        }
    }
}
