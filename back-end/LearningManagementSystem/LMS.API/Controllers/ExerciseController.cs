using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;

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

        [HttpPost]
        public async Task<IActionResult> CreateExercise([FromBody] CreateExerciseDTO exerciseDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdExercise = await _exerciseService.CreateExerciseAsync(exerciseDto);

                return CreatedAtAction(nameof(CreateExercise), new { id = createdExercise.Id }, createdExercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("add-exercise-to-subject")]
        public async Task<IActionResult> AddExerciseToSubject([FromBody] AddExerciseToSubjectDto dto)
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
    }
}
