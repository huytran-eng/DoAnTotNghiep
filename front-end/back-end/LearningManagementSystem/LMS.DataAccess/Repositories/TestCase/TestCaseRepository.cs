using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public class TestCaseRepository : BaseRepository<TestCase>, ITestCaseRepository
    {
        public TestCaseRepository(AppDbContext context) : base(context)
        {
        }
    }
}
