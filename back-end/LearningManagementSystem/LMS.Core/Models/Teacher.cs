using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Models
{
    public class Teacher
    {
        [Key, ForeignKey("User")]
        public int Id { get; set; }
        public virtual User User { get; set; }
    }
}
