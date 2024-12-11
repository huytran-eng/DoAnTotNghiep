using LMS.Core.Enums;

namespace LMS.BusinessLogic.DTOs
{
    public class StudentClassListDTO
    {
        public Guid Id { get; set; }
        public string StudentIdString { get; set; }
        public string Name { get; set; }
        public int ExercisesDone { get; set; }
        public int ExercisesCorrect { get; set; }
    }
}
