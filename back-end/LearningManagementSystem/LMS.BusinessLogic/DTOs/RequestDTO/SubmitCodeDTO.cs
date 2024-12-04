namespace LMS.BusinessLogic.DTOs
{
    public class SubmitCodeDTO
    {
        public string Code { get; set; }
        public Guid SubjectProgrammingLanguageId { get; set; }
        public Guid ClassExerciseId { get; set; }
    }
}
