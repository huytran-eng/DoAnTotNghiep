using System.ComponentModel.DataAnnotations;

namespace LMS.BusinessLogic.DTOs.RequestDTO
{
    public class AddExerciseToSubjectDTO
    {
        [Required]
        public Guid SubjectId { get; set; }
        [Required]
        public Guid ExerciseId { get; set; }
        [Required]
        public Guid TopicId { get; set; }
    }
}
