using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : Controller
    {
        private readonly IStudentSubmissionService _submissionService;
        public SubmissionController(IStudentSubmissionService submissionService)
        {
            _submissionService = submissionService;
        }


        [HttpPost("submit-code")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> SubmitCode([FromBody] SubmitCodeDTO submitCodeDto)
        {
           
            if (submitCodeDto == null)
                return BadRequest("Invalid submission data.");

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }
            submitCodeDto.StudentId = userId;
            var result = await _submissionService.EvaluateSubmissionAsync(submitCodeDto);
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

        [HttpGet("history/{classExerciseId:guid}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetSubmissionHistory(Guid classExerciseId)
        {
            // Validate that the user has access to view this data
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
            {
                return Unauthorized("Access denied.");
            }

            // Retrieve the submission history
            var result = await _submissionService.GetSubmissionsByClassExerciseAndStudentAsync(classExerciseId, currentUserId.Value);

            // Handle the result
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return result.Code switch
            {
                400 => BadRequest(result.Message),
                404 => NotFound(result.Message),
                _ => StatusCode(500, result.Message)
            };
        }


        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : (Guid?)null;
        }
    }
}
