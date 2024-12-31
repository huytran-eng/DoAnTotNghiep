using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.Services.Implementations;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly IClassService _classService;
        private readonly IStudentService _studentService;
        private readonly IUserService _userService;
        private readonly IExerciseService _exerciseService;
        private readonly IProgrammingLanguageService _programmingLanguageService;
        private readonly IStudentSubmissionService _studentSubmissionService;
        private readonly IStudyMaterialService _studyMaterialService;
        public ClassController(IClassService classService,
            IUserService userService,
            IStudentService studentService,
            IExerciseService exerciseService,
            IProgrammingLanguageService programmingLanguageService,
            IStudentSubmissionService studentSubmissionService,
            IStudyMaterialService studyMaterialService
            )
        {
            _classService = classService;
            _userService = userService;
            _studentService = studentService;
            _exerciseService = exerciseService;
            _programmingLanguageService = programmingLanguageService;
            _studentSubmissionService = studentSubmissionService;
            _studyMaterialService = studyMaterialService;
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
        [HttpPost("opentopic")]
        public async Task<IActionResult> OpenClassTopicAsync([FromBody] OpenClassTopicDTO openClassTopicDTO)
        {

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            // Validate input
            if (openClassTopicDTO == null)
            {
                return BadRequest("Invalid input.");
            }

            // Call the service method to open the class topic
            var result = await _classService.OpenClassTopicAsync(openClassTopicDTO, userId.Value);

            // Check if the result is successful
            if (result.IsSuccess)
            {
                return Ok(result); // Return the success result with a 200 status
            }
            else
            {
                // If not successful, return the error message with appropriate status
                return StatusCode(result.Code, result); // Use the provided status code
            }
        }

        [Authorize(Roles = "Admin")]
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

                    var result = await _classService.CreateClass(request, stream);

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

        [HttpGet("{classId}/students")]
        public async Task<IActionResult> GetStudentsByClass(Guid classId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            var result = await _studentService.GetStudentsForClass(classId, userId.Value);


            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.Code switch
                {
                    400 => BadRequest(result.Message),
                    404 => BadRequest(result.Message),
                    403 => BadRequest(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }



        [Authorize]
        [HttpGet("{id}/topics")]
        public async Task<IActionResult> GetClassTopicsAsync(Guid id)
        {

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            // Call the service method to open the class topic
            var result = await _classService.GetOpenClassTopicAsync(id, userId.Value);

            // Check if the result is successful
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.Code switch
                {
                    400 => BadRequest(result.Message),
                    404 => BadRequest(result.Message),
                    403 => BadRequest(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }

        [Authorize]
        [HttpGet("{id}/alltopics")]
        public async Task<IActionResult> GetAllClassTopicsAsync(Guid id)
        {

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            // Call the service method to open the class topic
            var result = await _classService.GetAvailableClassTopicAsync(id, userId.Value);

            // Check if the result is successful
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.Code switch
                {
                    400 => BadRequest(result.Message),
                    404 => BadRequest(result.Message),
                    403 => BadRequest(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }

        [Authorize]
        [HttpGet("{classId}/studymaterials")]
        public async Task<IActionResult> GetStudyMaterialsByClass(Guid classId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            var result = await _studyMaterialService.GetClassStudyMaterials(classId, userId.Value);


            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.Code switch
                {
                    400 => BadRequest(result.Message),
                    404 => BadRequest(result.Message),
                    403 => BadRequest(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }

        [Authorize(Roles = "Admin, Teacher")]
        [HttpPost("{id}/materialtoggle/{materialId}")]
        public async Task<IActionResult> ToggleStudyMaterialForClass(Guid id, Guid materialId)
        {
           
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized("UserId not found or invalid.");
                }
                // Call the service to toggle the study material for the class
                var result = await _studyMaterialService.ToggleStudyMaterialForClass(id, materialId, userId.Value);

                // Check if the operation was successful
                if (result.IsSuccess)
                {
                    return Ok(result.Data);
                }
                else
                {
                    return result.Code switch
                    {
                        400 => BadRequest(result.Message),
                        404 => BadRequest(result.Message),
                        403 => BadRequest(result.Message),
                        _ => StatusCode(500, result.Message)
                    };
                }
        }

        [Authorize]
        [HttpGet("{id}/student-submission/{studentId}")]
        public async Task<IActionResult> GetStudentSubmissionsForClass(Guid id, Guid studentId)
        {

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            // Call the service method to open the class topic
            var result = await _studentSubmissionService.GetSubmissionsByClassAndStudentAsync(id, studentId, userId.Value);

            // Check if the result is successful
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.Code switch
                {
                    400 => BadRequest(result.Message),
                    404 => BadRequest(result.Message),
                    403 => BadRequest(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }

        [Authorize(Roles = "Student")]
        [HttpGet("exercise/{id}")]
        public async Task<IActionResult> GetClassExerciseForStudent(Guid id)
        {

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            // Call the service method to open the class topic
            var result = await _exerciseService.GetClassExerciseForStudent(id, userId.Value);

            // Check if the result is successful
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.Code switch
                {
                    400 => BadRequest(result.Message),
                    404 => BadRequest(result.Message),
                    403 => BadRequest(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }

        [Authorize]
        [HttpGet("{id}/student/{studentId}")]
        public async Task<IActionResult> GetStudentDetailForClass(Guid id, Guid studentId)
        {

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            // Call the service method to open the class topic
            var result = await _studentService.GetStudentForClass(id, studentId, userId.Value);

            // Check if the result is successful
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.Code switch
                {
                    400 => BadRequest(result.Message),
                    404 => BadRequest(result.Message),
                    403 => BadRequest(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }

        [HttpGet("{id}/languages")]
        public async Task<IActionResult> GetClassProgrammingLanguages(Guid id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            var result = await _programmingLanguageService.GetClassProgrammingLanguages(id);


            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.Code switch
                {
                    400 => BadRequest(result.Message),
                    404 => BadRequest(result.Message),
                    403 => BadRequest(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClassDetail(Guid id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            var classResult = await _classService.GetClassDetailForUser(id, userId.Value);
            if (classResult.IsSuccess)
            {
                return Ok(classResult.Data);
            }
            else
            {
                return classResult.Code switch
                {
                    400 => BadRequest(classResult.Message),
                    404 => BadRequest(classResult.Message),
                    403 => BadRequest(classResult.Message),
                    _ => StatusCode(500, classResult.Message)
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
