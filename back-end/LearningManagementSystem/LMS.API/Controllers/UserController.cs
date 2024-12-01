using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDTO loginRequest)
        {
            var result = await _userService.LoginAsync(loginRequest);

            if (!result.IsSuccess)
            {
                return result.Code switch
                {
                    404 => NotFound(result.Message),
                    401 => Unauthorized(result.Message),
                    _ => BadRequest(result.Message)
                };
            }
            else return Ok(result.Data);
        }
    }
}
