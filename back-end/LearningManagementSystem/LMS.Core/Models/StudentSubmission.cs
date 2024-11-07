using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Core.Models
{
    public class StudentSubmission
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public string Code { get; set; }
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; }
        public int ClassExerciseId { get; set; }
        [ForeignKey("ClassExerciseId")]
        public ClassExercise ClassExercise { get; set; }
        public int SubjectProgrammingLanguageId { get; set; }
        [ForeignKey("SubjectProgrammingLanguageId")]
        public SubjectProgrammingLanguage SubjectProgrammingLanguage { get; set; }
    }
}
