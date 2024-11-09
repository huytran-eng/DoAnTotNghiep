using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public class ClassRepository : BaseRepository<Class>, IClassRepository
    {
        public ClassRepository(AppDbContext context) : base(context)
        {
        }
    }
}
