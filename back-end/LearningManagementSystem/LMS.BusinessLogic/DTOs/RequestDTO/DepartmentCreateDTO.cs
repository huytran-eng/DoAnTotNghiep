using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.DTOs
{
    public class DepartmentCreateDTO
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public Guid CurrentUserId { get; set; }

    }
}
