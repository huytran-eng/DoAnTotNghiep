using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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


        [Authorize]
        [HttpGet("list")]
        public async Task<IActionResult> ViewClasses(string? subjectName, string? sortBy, bool isDescending = false, int page = 1, int pageSize = 10)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            var classesResult = await _classService.GetClassesForUser(subjectName, sortBy, isDescending, page, pageSize, userId.Value);

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

            var classResult = _classService.GetClassDetailForUser(classId, userId.Value);
            return Ok();
        }

        [Authorize(Roles ="Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateClass([FromForm] IFormFile file, [FromForm] CreateClassDTO request)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized("UserId not found or invalid.");
                }
                request.CurrentUserId = userId.Value;
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream); // Copy file content to a MemoryStream
                    stream.Position = 0; // Reset the stream position to the beginning before passing to the service

                    var result = await _classService.CreateClass(request,stream);

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
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while importing students", Error = ex.Message });
            }
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : (Guid?)null;
        }
    }
}
