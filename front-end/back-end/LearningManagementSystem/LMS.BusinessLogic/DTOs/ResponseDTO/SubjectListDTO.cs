namespace LMS.BusinessLogic.DTOs
{
    public class SubjectListDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Credit { get; set; }
        public string DepartmentName { get; set; }
        public int NumberOfClasses { get; set; }

        public string Description { get; set; }
    }
}
