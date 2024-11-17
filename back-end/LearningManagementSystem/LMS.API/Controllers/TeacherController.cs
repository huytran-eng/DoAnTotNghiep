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
        public async Task<IActionResult> CreateTeacher([FromBody] TeacherDTO teacherDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _teacherService.CreateAsync(teacherDTO);

            if (!result.IsSuccess)
            {
                return StatusCode(500, result.Message);
            }
            
            return Ok(result);
        }
    }
}
