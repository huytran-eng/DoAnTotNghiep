namespace LMS.BusinessLogic.DTOs
{
    public class ClassListDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int NumberOfStudent { get; set; }
        public string? TeacherName { get; set; }
        public string? SubjectName { get; set; }
        public int Status { get; set; }
    }
}
