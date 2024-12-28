namespace LMS.BusinessLogic.DTOs
{
    public class CreateStudyMaterialDTO
    {
        public string Title { get; set; }
        public string? MaterialLink { get; set; }
        public Guid SubjectId { get; set; }
    }
}
