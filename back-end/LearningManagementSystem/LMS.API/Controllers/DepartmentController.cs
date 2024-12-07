using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    public class DepartmentController : Controller
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateDepartment([FromBody] DepartmentCreateDTO departmentCreateDTO)
        {
            var result = await _departmentService.CreateDepartmentAsync(departmentCreateDTO);

            if (result.IsSuccess)
            {
                return Ok(result.Message);
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

        [Authorize]        
        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetAllDepartments()
        {
            var result = await _departmentService.GetAllDepartmentsAsync();

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
