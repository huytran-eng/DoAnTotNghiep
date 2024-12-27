using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.DTOs
{
    public class DepartmentDTO
    {
        public Guid Id { get; set; }           
        public string Name { get; set; }        
        public string? Description { get; set; } 

        public List<SubjectDTO> Subjects { get; set; }
    }
}
