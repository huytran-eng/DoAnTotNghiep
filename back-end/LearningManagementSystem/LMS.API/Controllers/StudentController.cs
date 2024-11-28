using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : Controller
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpPost("import")]
        public async Task<IActionResult> ImportStudents(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream); // Copy file content to a MemoryStream
                    stream.Position = 0; // Reset the stream position to the beginning before passing to the service

                    var result = await _studentService.ImportStudents(stream); // Pass the stream to the service

                    if (result.IsSuccess)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return result.Code switch
                        {
                            400 => BadRequest(result),
                            _ => StatusCode(500, result)
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while importing students", Error = ex.Message });
            }
        }

    }
}
