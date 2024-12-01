namespace LMS.BusinessLogic.DTOs
{
    public class SubjectExerciseListDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Difficulty { get; set; }
        public string TopicName { get; set; }
        public DateTime AddedDate  { get; set; }
        public Guid SubjectId { get; set; }
        public Guid ExerciseId { get; set; }
        public Guid TopicId { get; set; }
    }
}
