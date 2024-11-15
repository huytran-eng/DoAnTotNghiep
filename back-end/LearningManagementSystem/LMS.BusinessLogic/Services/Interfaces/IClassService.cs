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
        Task<CommonResult<object>> CreateClass(CreateClassRequest createClassRequest);

        Task<CommonResult<PaginatedResultDTO<ClassDTO>>> GetClassesForUser(ViewClassRequestDTO viewClassRequest);
        Task<CommonResult<ClassDTO>> GetClassDetailForUser(Guid classId, Guid userId);
    }
}
