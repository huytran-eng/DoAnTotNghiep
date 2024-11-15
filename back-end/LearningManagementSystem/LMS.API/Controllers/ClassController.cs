using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly IClassService _classService;
        private readonly IUserService _userService;

        public ClassController(IClassService classService, IUserService userService)
        {
            _classService = classService;
            _userService = userService;
        }


        // TODO change the get user logic to the service, remove the get user info by id method in the controller
        [Authorize]
        [HttpGet("list")]
        public async Task<IActionResult> ViewClasses([FromQuery] ViewClassRequestDTO request)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            var classesResult = await _classService.GetClassesForUser(request);

            if (!classesResult.IsSuccess)
            {
                return StatusCode(500, classesResult.Message);
            }

            return Ok(classesResult.Data);
        }

        [Authorize]
        [HttpGet("detail")]
        public async Task<IActionResult> GetClassDetail([FromQuery] Guid classId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            var classResult = _classService.GetClassDetail(classId);
            return Ok();
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateClass(CreateClassRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }
            request.CurrentUserId = userId.Value;
            var result = await _classService.CreateClass(request);

            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return result.Code switch
                {
                    400 => BadRequest(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : (Guid?)null;
        }
    }
}
