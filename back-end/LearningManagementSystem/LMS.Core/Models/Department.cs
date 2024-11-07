using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Core.Models
{
    public class Department:BaseEntity
    {
        public string Name { get; set; }
        public string? Description { get; set; }

        public int UniversityId { get; set; }

        [ForeignKey("UniversityId")]
        public virtual University University { get; set; }

        public ICollection<Subject> Subjects { get; set; }
    }
}
