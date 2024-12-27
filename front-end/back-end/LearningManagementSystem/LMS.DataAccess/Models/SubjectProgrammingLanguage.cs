using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.DataAccess.Models
{
    public class SubjectProgrammingLanguage : BaseEntity
    {
        public Guid SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }
        public Guid ProgrammingLanguageId { get; set; }
        [ForeignKey("ProgrammingLanguageId")]
        public ProgrammingLanguage ProgrammingLanguage { get; set; }
    }
}
