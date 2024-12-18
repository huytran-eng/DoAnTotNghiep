using LMS.BusinessLogic.Services.Implementations;
using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
        [HttpGet("")]
        public async Task<IActionResult> GetStudentsListForAdmin(string? studentName, string? sortBy, bool isDescending = false, int page = 1, int pageSize = 10)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }
            var studentsResult = await _studentService.GetStudentsForAdmin(studentName, sortBy, isDescending, page, pageSize, userId.Value);
            if (studentsResult.IsSuccess)
            {
                return Ok(studentsResult.Data);
            }
            else
            {
                return studentsResult.Code switch
                {
                    400 => BadRequest(studentsResult.Message),
                    _ => StatusCode(500, studentsResult.Message)
                };
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentDetails(Guid id)
        {
            try
            {
                // Fetch student details using the student service
                var studentDetailsResult = await _studentService.GetStudentDetails(id);

                if (studentDetailsResult.IsSuccess)
                {
                    return Ok(studentDetailsResult.Data);
                }
                else
                {
                    return studentDetailsResult.Code switch
                    {
                        400 => BadRequest(studentDetailsResult.Message),
                        _ => StatusCode(500, studentDetailsResult.Message)
                    };
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching student details", Error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("{id}/classes")]
        public async Task<IActionResult> GetStudentClasses(Guid id)
        {
            try
            {
                // Fetch student classes using the student service
                var studentClassesResult = await _studentService.GetStudentClasses(id);

                if (studentClassesResult.IsSuccess)
                {
                    return Ok(studentClassesResult.Data);
                }
                else
                {
                    return studentClassesResult.Code switch
                    {
                        400 => BadRequest(studentClassesResult.Message),
                        _ => StatusCode(500, studentClassesResult.Message)
                    };
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching student classes", Error = ex.Message });
            }
        }

        //[Authorize]
        //[HttpGet("{id}/submissions")]
        //public async Task<IActionResult> GetStudentSubmissions(Guid id)
        //{
        //    try
        //    {
        //        // Fetch student submissions using the student service
        //        var studentSubmissionsResult = await _studentService.GetStudentSubmissions(id);

        //        if (studentSubmissionsResult.IsSuccess)
        //        {
        //            return Ok(studentSubmissionsResult.Data);
        //        }
        //        else
        //        {
        //            return studentSubmissionsResult.Code switch
        //            {
        //                400 => BadRequest(studentSubmissionsResult.Message),
        //                _ => StatusCode(500, studentSubmissionsResult.Message)
        //            };
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { Message = "An error occurred while fetching student submissions", Error = ex.Message });
        //    }
        //}

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : (Guid?)null;
        }
    }
}
