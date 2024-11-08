using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

            var createdTeacher = await _teacherService.CreateAsync(teacherDTO);

            return CreatedAtAction(nameof(CreateTeacher), new { id = createdTeacher.Id }, createdTeacher);
        }
    }
}
