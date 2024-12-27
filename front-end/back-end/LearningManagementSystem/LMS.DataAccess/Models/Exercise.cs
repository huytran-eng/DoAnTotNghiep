using LMS.Core.Enums;

namespace LMS.DataAccess.Models
{
    public class Exercise : BaseEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public DifficultyLevel Difficulty { get; set; }
        public int TimeLimit { get; set; } // Time limit in seconds
        public int SpaceLimit { get; set; } // Space limit in MB

        public ICollection<TestCase> TestCases { get; set; }
        public ICollection<SubjectExercise> SubjectExercises { get; set; }
    }
}
