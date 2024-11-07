using LMS.API.ViewModels;
using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserLoginViewModel user)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var userInfo = new UserDTO
                    {
                        Username = user.UserName,
                        Password = user.Password,
                        Email = user.Email,
                        Name = user.Name,
                        BirthDate = user.BirthDate,
                        Phone = user.Phone,
                        Address = user.Address,
                    };
                    var userDTO = await _userService.RegisterAsync(userInfo);
                    return Ok(userDTO);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return BadRequest("Invalid data.");
        }
    }
}
