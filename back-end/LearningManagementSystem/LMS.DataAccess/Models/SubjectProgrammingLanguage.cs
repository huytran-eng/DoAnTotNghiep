using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Models
{
    public class SubjectProgrammingLanguage : BaseEntity
    {
        public Guid Id { get; set; }
        public Guid SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }
        public Guid ProgrammingLanguageId { get; set; }
        [ForeignKey("ProgrammingLanguageId")]
        public ProgrammingLanguage ProgrammingLanguage { get; set; }
    }
}
