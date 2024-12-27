using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    public class ProgrammingLanguageController : Controller
    {
        private readonly IProgrammingLanguageService _programmingLanguageService;

        public ProgrammingLanguageController(IProgrammingLanguageService departmentService)
        {
            _programmingLanguageService = departmentService;
        }


        [Authorize]        
        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetAllProgrammingLanguages()
        {
            var result = await _programmingLanguageService.GetAllProgrammingLanguagesAsync();

            if (result.IsSuccess && result.Data != null)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.Code switch
                {
                    404 => NotFound(result.Message),
                    _ => StatusCode(500, result.Message)
                };
            }
        }

    }
}
