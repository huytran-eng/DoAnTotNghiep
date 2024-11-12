using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.DTOs
{
    public class UniversityDTO
    {
        public Guid Id { get; set; }           
        public string Name { get; set; }         
        public string Address { get; set; }      
        public string Phone { get; set; }        
        public string? Description { get; set; }

        // Collection of associated departments
        public List<DepartmentDTO> Departments { get; set; }
    }
}
