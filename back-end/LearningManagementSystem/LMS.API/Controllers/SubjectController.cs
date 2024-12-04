using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.Services.Implementations;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Drawing.Printing;
using System.Globalization;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : Controller
    {
        private readonly ISubjectService _subjectService;
        private readonly IExerciseService _exerciseService;
        private readonly IClassService _classService;
        private readonly IProgrammingLanguageService _programmingLanguageService;

        public SubjectController(ISubjectService subjectService, IExerciseService exerciseService, IClassService classService, IProgrammingLanguageService programmingLanguageService)
        {
            _subjectService = subjectService;
            _exerciseService = exerciseService;
            _classService = classService;
            _classService = classService;
            _programmingLanguageService = programmingLanguageService;
        }

        [Authorize]
        [HttpGet("")]
        public async Task<IActionResult> GetSubjectsForUser(string? subjectName, string? sortBy, bool isDescending = false, int page = 1, int pageSize = 10)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }
            var subjectsResult = await _subjectService.GetSubjectsForUser(subjectName, sortBy, isDescending, page, pageSize, userId.Value);
            if (!subjectsResult.IsSuccess)
            {
                return StatusCode(500, subjectsResult.Message);
            }

            return Ok(subjectsResult.Data);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubjectDetail(Guid id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            // Fetch subject details for the specific user
            var subjectResult = await _subjectService.GetSubjectDetailForUser(id, userId.Value);

            if (!subjectResult.IsSuccess)
            {
                return StatusCode(500, subjectResult.Message);
            }

            // Return subject details
            return Ok(subjectResult.Data);
        }

        [HttpGet("{subjectId}/exercises")]
        public async Task<IActionResult> GetExercisesBySubject(Guid subjectId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            var subjectExercise = await _exerciseService.GetExerciseForSubject(subjectId, userId.Value);


            if (subjectExercise.IsSuccess)
            {
                return Ok(subjectExercise.Data);
            }
            else
            {
                return subjectExercise.Code switch
                {
                    400 => BadRequest(subjectExercise.Message),
                    404 => BadRequest(subjectExercise.Message),
                    403 => BadRequest(subjectExercise.Message),
                    _ => StatusCode(500, subjectExercise.Message)
                };
            }
        }


        [HttpGet("{subjectId}/classes")]
        public async Task<IActionResult> GetClassesBySubject(Guid subjectId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            var subjectExercise = await _classService.GetClassesForSubject(subjectId, userId.Value);


            if (subjectExercise.IsSuccess)
            {
                return Ok(subjectExercise.Data);
            }
            else
            {
                return subjectExercise.Code switch
                {
                    400 => BadRequest(subjectExercise.Message),
                    404 => BadRequest(subjectExercise.Message),
                    403 => BadRequest(subjectExercise.Message),
                    _ => StatusCode(500, subjectExercise.Message)
                };
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("addExercise")]
        public async Task<IActionResult> AddExerciseToSubject([FromBody] AddExerciseToSubjectDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid input");
            try
            {
                var result = await _exerciseService.AddExerciseToSubjectAsync(dto);
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

        [HttpGet("{subjectId}/languages")]
        public async Task<IActionResult> GetSubjectProgrammingLanguage(Guid subjectId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            var subjectExercise = await _programmingLanguageService.GetSubjectProgrammingLanguages(subjectId);


            if (subjectExercise.IsSuccess)
            {
                return Ok(subjectExercise.Data);
            }
            else
            {
                return subjectExercise.Code switch
                {
                    400 => BadRequest(subjectExercise.Message),
                    404 => BadRequest(subjectExercise.Message),
                    403 => BadRequest(subjectExercise.Message),
                    _ => StatusCode(500, subjectExercise.Message)
                };
            }
        }

    }
}
