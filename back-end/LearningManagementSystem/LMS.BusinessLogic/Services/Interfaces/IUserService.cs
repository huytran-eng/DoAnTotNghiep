using LMS.BusinessLogic.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserDTO> LoginAsync(string username, string password);
        Task<UserDTO> RegisterAsync(UserDTO userDTO);


    }
}
