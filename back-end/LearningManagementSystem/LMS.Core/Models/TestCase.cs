using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Core.Models
{
    public class TestCase : BaseEntity
    {
        public string Input { get; set; }
        public string ExpectedOutput { get; set; }
        public string? Description { get; set; }
        public bool IsHidden { get; set; }
        public int ExerciseId { get; set; }
        [ForeignKey("ExerciseId")]
        public virtual Exercise Exercise { get; set; }
    }
}
