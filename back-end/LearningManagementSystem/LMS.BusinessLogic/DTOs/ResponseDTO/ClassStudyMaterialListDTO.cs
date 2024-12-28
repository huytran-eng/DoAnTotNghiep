namespace LMS.BusinessLogic.DTOs
{
    public class ClassStudyMaterialListDTO
    {
        public Guid Id { get; set; }

        public string Title { get; set; }
        public string MaterialLink { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? OpenDate { get; set; }
        public bool IsOpen { get; set; }    
    }
}
