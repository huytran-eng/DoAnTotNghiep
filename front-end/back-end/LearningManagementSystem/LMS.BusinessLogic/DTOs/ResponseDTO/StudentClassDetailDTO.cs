namespace LMS.BusinessLogic.DTOs.ResponseDTO
{
    public class StudentClassDetailDTO
    {
        public Guid Id { get; set; }
        public string StudentIdString { get; set; }
        public string Name { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Email { get; set; }
        public int ExercisesDone { get; set; }
        public int ExercisesCorrect { get; set; }
        public string ClassName { get; set; } 
        public string SubjectName { get; set; }
    }
}
