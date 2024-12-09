using LMS.Core.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.DataAccess.Models
{
    public class StudentSubmission
    {
        public Guid Id { get; set; }
        public StudentSubmissionStatus Status { get; set; }
        public DateTime SubmitDate { get; set; }
        public string Code { get; set; }
        public int ExecutionTime { get; set; }
        public int MemoryUsed { get; set; }
        public Guid StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; }
        public Guid ClassExerciseId { get; set; }
        [ForeignKey("ClassExerciseId")]
        public ClassExercise ClassExercise { get; set; }
        public Guid SubjectProgrammingLanguageId { get; set; }
        [ForeignKey("SubjectProgrammingLanguageId")]
        public SubjectProgrammingLanguage SubjectProgrammingLanguage { get; set; }
    }
}
