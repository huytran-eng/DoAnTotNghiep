using LMS.BusinessLogic.DTOs;
using LMS.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IDepartmentService
    {
        Task<CommonResult<DepartmentDTO>> CreateDepartmentAsync(DepartmentCreateDTO departmentCreateDTO);
        Task<CommonResult<List<DepartmentDTO>>> GetAllDepartmentsAsync();
    }

}
