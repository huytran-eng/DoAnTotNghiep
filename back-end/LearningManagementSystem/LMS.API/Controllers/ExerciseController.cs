using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.Services.Implementations;
using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExerciseController : Controller
    {
        private readonly IExerciseService _exerciseService;

        public ExerciseController(IExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }

        //[Authorize]
        //[HttpGet("list-class-exercise")]
        //public async Task<IActionResult> ViewClassExercise(string exerciseName, string sortBy, bool isDescending = false, int page = 1, int pageSize = 10)
        //{
        //    var userId = GetCurrentUserId();
        //    if (userId == null)
        //    {
        //        return Unauthorized("UserId not found or invalid.");
        //    }

        //    var classesResult = await _exerciseService.GetClassExercises(exerciseName, sortBy, isDescending, page, pageSize, userId.Value);

        //    if (!classesResult.IsSuccess)
        //    {
        //        return StatusCode(500, classesResult.Message);
        //    }

        //    return Ok(classesResult.Data);
        //}

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateExercise([FromBody] CreateExerciseDTO exerciseDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("UserId not found or invalid.");
            }

            exerciseDto.CurrentUserId = userId;
            try
            {
                var result = await _exerciseService.CreateExerciseAsync(exerciseDto);

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
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add-exercise-to-subject")]
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
    }
}
