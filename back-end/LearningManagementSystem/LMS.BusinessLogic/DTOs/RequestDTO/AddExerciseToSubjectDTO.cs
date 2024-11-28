namespace LMS.BusinessLogic.DTOs.RequestDTO
{
    public class AddExerciseToSubjectDTO
    {
        public Guid SubjectId { get; set; }
        public Guid ExerciseId { get; set; }
        public Guid TopicId { get; set; }
    }
}
