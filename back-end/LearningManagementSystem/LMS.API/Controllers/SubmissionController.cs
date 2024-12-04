using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.DataAccess.Models;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : Controller
    {
        private readonly ISubmissionService _submissionService;
        public SubmissionController(ISubmissionService submissionService)
        {
            _submissionService = submissionService;
        }


        [HttpPost("submit-code")]
        public async Task<IActionResult> SubmitCode([FromBody] SubmitCodeDTO submitCodeDto)
        {
            if (submitCodeDto == null)
                return BadRequest("Invalid submission data.");

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
    }
}
