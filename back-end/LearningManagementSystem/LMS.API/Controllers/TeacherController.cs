using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : Controller
    {
        private readonly ITeacherService _teacherService;

        public TeacherController(ITeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateTeacher([FromBody] CreateTeacherDTO teacherDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _teacherService.CreateAsync(teacherDTO);

            if (result.IsSuccess)
            {
                return Ok(result.Data);
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

        [Authorize(Roles = "Admin")] 
        [HttpGet("")]
        public async Task<IActionResult> GetTeachers()
        {
            var result = await _teacherService.GetAllTeachers();

            if (result.IsSuccess)
            {
                return Ok(result.Data);
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

        [Authorize(Roles = "Admin")]
        [HttpGet("department/{id}")]
        public async Task<IActionResult> GetTeachersByDepartment(Guid id)
        {
            var result = await _teacherService.GetTeachersByDepartmentIdAsync(id);

            if (result.IsSuccess)
            {
                return Ok(result.Data);
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

        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTeacherDetail(Guid id)
        {
            var result = await _teacherService.GetTeacherDetail(id);

            if (result.IsSuccess)
            {
                return Ok(result.Data);
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
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditTeacher(Guid id, [FromBody] EditTeacherDTO updateTeacherDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _teacherService.EditTeacherAsync(id, updateTeacherDTO);

            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.Code switch
                {
                    400 => BadRequest(result.Message),
                    404 => NotFound(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }

    }
}
