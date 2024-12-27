using LMS.DataAccess.Models;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
