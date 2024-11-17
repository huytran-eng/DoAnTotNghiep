using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.DataAccess.Models
{
    public class Student
    {
        [Key, ForeignKey("User")]
        public Guid Id { get; set; }
        public string StudentIdString { get; set; }   
        public virtual User User { get; set; }

        public virtual ICollection<StudentClass> StudentClasses { get; set; }
    }
}
