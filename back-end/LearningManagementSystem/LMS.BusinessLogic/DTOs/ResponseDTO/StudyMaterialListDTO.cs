namespace LMS.BusinessLogic.DTOs
{
    public class StudyMaterialListDTO
    {
        public Guid Id { get; set; }

        public string Title { get; set; }
        public string MaterialLink { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
