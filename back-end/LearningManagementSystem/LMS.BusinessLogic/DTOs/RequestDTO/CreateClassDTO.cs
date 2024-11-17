using System.ComponentModel.DataAnnotations;

namespace LMS.BusinessLogic.DTOs
{
    public class CreateClassDTO
    {
        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public Guid TeacherId { get; set; }

        [Required]
        public Guid SubjectId { get; set; }

        [Required]
        public List<Guid> StudentIds { get; set; }

        public Guid CurrentUserId { get; set; }
    }

}
