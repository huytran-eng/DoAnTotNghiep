using LMS.Core.Enums;

namespace LMS.BusinessLogic.DTOs
{
    public class TeacherDetailDTO
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }

        public int NumberOfClasses { get; set; }
        public ICollection<ClassListDTO> Classes { get; set; }
    }

}
