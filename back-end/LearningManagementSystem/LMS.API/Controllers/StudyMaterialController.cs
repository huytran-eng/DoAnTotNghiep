using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudyMaterialController : Controller
    {
        private readonly IStudyMaterialService _studyMaterialService;
        private readonly ISubjectService _subjectService;
        private readonly IExerciseService _exerciseService;
        private readonly IClassService _classService;
        private readonly IProgrammingLanguageService _programmingLanguageService;

        public StudyMaterialController(ISubjectService subjectService, IExerciseService exerciseService, IClassService classService, IProgrammingLanguageService programmingLanguageService, IStudyMaterialService studyMaterialService)
        {
            _subjectService = subjectService;
            _exerciseService = exerciseService;
            _classService = classService;
            _classService = classService;
            _programmingLanguageService = programmingLanguageService;
            _studyMaterialService = studyMaterialService;
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] IFormFile file, [FromForm] CreateStudyMaterialDTO createStudyMaterialDTO)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            try
            {
                // Retrieve the current user ID
                var currentUserId = GetCurrentUserId();
                if (currentUserId == null)
                {
                    return Unauthorized("User ID not found.");
                }

                // Call the service to handle the business logic
                var result = await _studyMaterialService.CreateStudyMaterialAsync(createStudyMaterialDTO, file, currentUserId.Value);

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
            catch (Exception ex)
            {
                // Log the exception (use a logging framework here)
                return StatusCode(500, new { Error = "An error occurred while creating the study material.", Details = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("download/{id:guid}")]
        public async Task<IActionResult> Download(Guid id)
        {
            try
            {
                // Call the service to handle the download logic
                var result = await _studyMaterialService.DownloadStudyMaterialAsync(id);

                if (!result.IsSuccess)
                {
                    return result.Code switch
                    {
                        404 => NotFound(result.Message),
                        403 => Forbid(result.Message),
                        _ => StatusCode(500, result.Message)
                    };
                }

                // Return the file from the service
                return File(result.Data.FileBytes, result.Data.ContentType, result.Data.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "An error occurred while downloading the file.", Details = ex.Message });
            }
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : (Guid?)null;
        }
    }
}
