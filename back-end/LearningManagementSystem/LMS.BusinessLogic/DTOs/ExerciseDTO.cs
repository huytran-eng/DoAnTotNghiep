using LMS.Core.Enums;

namespace LMS.BusinessLogic.DTOs
{
    public class CreateExerciseDTO
    {
        public Guid? Id { get; set; } 
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public DifficultyLevel Difficulty { get; set; } 
        public int TimeLimit { get; set; } // Time limit in milliseconds.
        public int SpaceLimit { get; set; } // Space limit in kilobytes.
        public Guid? CurrentUserId { get; set; }

        // A collection of Test Cases for this exercise
        public List<TestCaseDTO> TestCases { get; set; } = new List<TestCaseDTO>();
    }
}
