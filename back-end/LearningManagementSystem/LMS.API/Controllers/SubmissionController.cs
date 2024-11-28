//using Microsoft.AspNetCore.Mvc;

//namespace LMS.API.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class SubmissionController : Controller
//    {
//        private readonly ISubmissionService _submissionService;

//        [HttpPost("submit-code")]
//        public async Task<IActionResult> SubmitCode([FromBody] SubmitCodeDTO submitCodeDto)
//        {
//            if (submitCodeDto == null)
//                return BadRequest("Invalid submission data.");

//            var result = await _submissionService.SubmitCodeAsync(submitCodeDto);
//            return Ok(result);
//        }
//    }
//}
