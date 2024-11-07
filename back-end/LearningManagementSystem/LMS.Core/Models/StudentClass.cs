using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Models
{
    public class StudentClass
    {
        public int Id { get; set; }
        public string status {  get; set; }
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; }
        public int ClassId { get; set; }
        [ForeignKey("ClassId")]
        public Class Class { get; set; }
    }
}
