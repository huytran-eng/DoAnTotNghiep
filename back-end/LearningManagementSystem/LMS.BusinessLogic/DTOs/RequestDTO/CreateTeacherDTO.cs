using LMS.Core.Enums;

namespace LMS.BusinessLogic.DTOs
{
    public class CreateTeacherDTO
    {
        public string Name { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public Guid DepartmentId { get; set; }
    }
}
