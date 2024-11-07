using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Models
{
    public class SubjectProgrammingLanguage : BaseEntity
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }
        public int ProgrammingLanguageId { get; set; }
        [ForeignKey("ProgrammingLanguageId")]
        public ProgrammingLanguage ProgrammingLanguage { get; set; }
    }
}
