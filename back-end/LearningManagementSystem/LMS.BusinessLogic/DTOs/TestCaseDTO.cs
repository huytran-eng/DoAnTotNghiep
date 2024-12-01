namespace LMS.BusinessLogic.DTOs
{
    public class TestCaseDTO
    {
        public Guid? Id { get; set; }
        public string Input { get; set; }
        public string Output { get; set; }
        public string? Description { get; set; }
        public bool IsHidden { get; set; }
    }
}
