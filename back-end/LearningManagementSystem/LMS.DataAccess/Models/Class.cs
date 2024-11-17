using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.DataAccess.Models
{
    public class Class : BaseEntity
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid TeacherId { get; set; }
        [ForeignKey("TeacherId")]
        public virtual Teacher Teacher { get; set; }
        public Guid SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public virtual Subject Subject { get; set; }

        public virtual ICollection<StudentClass> StudentClasses { get; set; }
        public virtual ICollection<ClassExercise> ClassExercises { get; set; }
        public virtual ICollection<ClassStudyMaterial> ClassStudyMaterial { get; set; }
        public virtual ICollection<Topic> Topics { get; set; }


    }
}
