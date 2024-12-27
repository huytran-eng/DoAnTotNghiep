using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Models
{
    public class University : BaseEntity
    {
        public string Name { get; set; }
        public string Address { get; set; } 
        public string Phone {  get; set; }
        public string? Description { get; set; }

        public ICollection<Department> Departments { get; set; }
    }
}
