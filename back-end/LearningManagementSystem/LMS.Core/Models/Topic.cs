using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Core.Models
{
    public class Topic : BaseEntity
    {
        public string Name { get; set; }    
        public string Description { get; set; }
        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }
    }
}
