using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<List<User>> GetUsersWithPrefixAsync(string prefix);
        Task<User> GetByEmailAsync(string email);
    }
}
