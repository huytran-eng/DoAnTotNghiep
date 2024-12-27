using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.DTOs.ResponseDTO;
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
        Task<CommonResult<LoginResponseDTO>> LoginAsync(LoginRequestDTO userDTO);

        Task<CommonResult<UserDTO>> GetUserInformationById(Guid userId);
    }
}
