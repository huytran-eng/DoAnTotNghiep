using LMS.Core.Enums;

namespace LMS.BusinessLogic.DTOs
{
    public class UpdateExerciseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public DifficultyLevel Difficulty { get; set; }
        public int TimeLimit { get; set; }
        public int SpaceLimit { get; set; }

        // Test cases to add to the Exercise
        public List<TestCaseDTO> NewTestCases { get; set; } = new List<TestCaseDTO>();

        public Guid? CurrentUserId { get; set; }
    }

}
