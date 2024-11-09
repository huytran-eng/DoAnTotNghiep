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
    }
}
