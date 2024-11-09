using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Models
{
    public class StudentClass
    {
        public Guid Id { get; set; }
        public string Status {  get; set; }
        public Guid StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; }
        public Guid ClassId { get; set; }
        [ForeignKey("ClassId")]
        public Class Class { get; set; }
    }
}
