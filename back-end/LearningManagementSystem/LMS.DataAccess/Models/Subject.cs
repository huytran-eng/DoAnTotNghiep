using System.ComponentModel.DataAnnotations.Schema;

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
        public ICollection<Topic> Topics { get; set; }
        public ICollection<SubjectExercise> SubjectExercises { get; set; }
        public ICollection<Class> Classes { get; set; }

    }
}
