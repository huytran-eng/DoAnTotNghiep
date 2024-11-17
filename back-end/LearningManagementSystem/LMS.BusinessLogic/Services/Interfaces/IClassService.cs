using LMS.BusinessLogic.DTOs;
using LMS.Core;
using LMS.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IClassService
    {
        Task<CommonResult<object>> CreateClass(CreateClassDTO createClassRequest);

        Task<CommonResult<PaginatedResultDTO<ClassDTO>>> GetClassesForUser(string? subject,
            string sortBy,
            bool isDescending,
            int page,
            int pageSize,
            Guid userId);
        Task<CommonResult<ClassDTO>> GetClassDetailForUser(Guid classId, Guid userId);

        Task<CommonResult<List<StudentDTO>>> GetStudentsByClassAsync(Guid classId, Guid userId);
        Task<CommonResult<List<ClassStudyMaterialDTO>>> GetStudyMaterialsForClassAsync(Guid classId, Guid userId);
    }
}
