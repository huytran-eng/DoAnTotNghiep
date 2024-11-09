using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.DTOs
{
    public class CreateClassRequest
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
    }

}
