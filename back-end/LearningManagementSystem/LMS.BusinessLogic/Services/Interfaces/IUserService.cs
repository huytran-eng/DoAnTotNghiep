using LMS.BusinessLogic.DTOs;
using LMS.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IUserService
    {
        Task<CommonResult<UserDTO>> LoginAsync(UserDTO userDTO);

        Task<CommonResult<UserDTO>> GetUserInformationById(Guid userId);
    }
}
