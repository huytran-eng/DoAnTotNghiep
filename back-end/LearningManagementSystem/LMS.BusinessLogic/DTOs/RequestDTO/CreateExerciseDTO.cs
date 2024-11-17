namespace LMS.BusinessLogic.DTOs
{
	public class CreateExerciseDTO
	{
		public string Title { get; set; }
		public string Description { get; set; }
		public string Requirements { get; set; }
		public DifficultyLevel Difficulty { get; set; }
		public int TimeLimit { get; set; }
		public int SpaceLimit { get; set; }
		public List<TestCaseDto> TestCases { get; set; } = new List<TestCaseDto>();
	}
}