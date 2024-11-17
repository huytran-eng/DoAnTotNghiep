using LMS.DataAccess.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.BusinessLogic.DTOs
{
    public class ClassExerciseDTO
    {
        public Guid Id { get; set; }
        public Guid ClassTopicOpenId { get; set; }
        [ForeignKey("ClassTopicOpenId")]
        public virtual ClassTopicOpen ClassTopicOpen { get; set; }
        public Guid SubjectExerciseId { get; set; }
        [ForeignKey("SubjectExerciseId")]
        public virtual SubjectExercise SubjectExercise { get; set; }
    }
}
