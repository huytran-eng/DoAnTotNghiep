namespace LMS.BusinessLogic.DTOs
{
    public class ExerciseListDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Difficulty { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
