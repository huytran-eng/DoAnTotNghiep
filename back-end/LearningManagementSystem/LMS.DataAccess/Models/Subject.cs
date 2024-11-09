using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Models
{
    public class Subject:BaseEntity
    {
        public string Name { get; set; }
        public int Credit { get; set; }
        public string Description { get; set; }

        public Guid DepartmentId { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; }

        //public ICollection<>

    }
}
