//using LMS.BusinessLogic.DTOs;
//using LMS.BusinessLogic.Services.Interfaces;
//using Microsoft.AspNetCore.Mvc;

//namespace LMS.API.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class SubjectController : Controller
//    {
//        private readonly ISubjectService _subjectService;

//        public SubjectController(IExerciseService exerciseService)
//        {
//            _exerciseService = exerciseService;
//        }

//        [HttpPost]
//        public async Task<IActionResult> CreateExercise([FromBody] CreateExerciseDTO exerciseDto)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);

//            try
//            {
//                var createdExercise = await _exerciseService.CreateExerciseAsync(exerciseDto);

//                return CreatedAtAction(nameof(CreateExercise), new { id = createdExercise.Id }, createdExercise);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Internal server error: {ex.Message}");
//            }
//        }


//    }
//}
