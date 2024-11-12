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

        //[Authorize]
        //[HttpGet]
        //public async Task<IActionResult> ViewClasses(string? subject = null,
        //                                            string? sortBy = "name",
        //                                            bool isDescending = false,
        //                                            int page = 1,
        //                                            int pageSize = 10)
        //{
        //    var userId = GetCurrentUserId();
        //    if (userId == null)
        //    {
        //        return Unauthorized("UserId not found or invalid.");
        //    }

        //    var userResult = await _userService.GetUserInformationById(userId.Value);

        //    if (!userResult.IsSuccess)
        //    {
        //        return userResult.Code switch
        //        {
        //            404 => NotFound(userResult.Message),
        //            _ => StatusCode(500, userResult.Message)
        //        };
        //    }

        //    UserDTO userDTO = userResult.Data;
        //    var classesResult = new CommonResult<ClassDTO>();

        //    if (userDTO.Position == PositionEnum.Admin.ToString())
        //    {
        //        classesResult = _classService.GetAllClasses();
        //    }

        //    else if (userDTO.Position == PositionEnum.Teacher.ToString())
        //    {
        //        classesResult = _classService.GetClassesTaughtByTeacher(userId);
        //    }

        //    else
        //    {
        //        classesResult = _classService.GetClassesForStudent(userId);
        //    }

        //}

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
