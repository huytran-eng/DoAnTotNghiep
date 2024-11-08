namespace LMS.DataAccess.Models
{
    public class Exercise:BaseEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public int Difficulty { get; set; }
        public int TimeLimit { get; set; }
        public int SpaceLimit { get; set; }

        public ICollection<TestCase> TestCases { get; set; }
    }
}
