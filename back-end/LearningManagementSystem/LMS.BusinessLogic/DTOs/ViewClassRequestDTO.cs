using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.DTOs
{
    public class ViewClassRequestDTO
    {
        public string? Subject { get; set; }
        public string SortBy { get; set; };
        public bool IsDescending { get; set; } = false;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public Guid CurrentUserId { get; set; }

    }
}
