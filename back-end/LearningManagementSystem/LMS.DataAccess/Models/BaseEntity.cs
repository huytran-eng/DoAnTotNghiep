using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.DataAccess.Models
{
    public abstract class BaseEntity
    {
        [Key]
        public Guid Id { get; set; } 

        public int? UpdatedById { get; set; }

        [ForeignKey(nameof(UpdatedById))]
        public virtual User? UpdatedBy { get; set; }
        public int CreatedById { get; set; }

        [ForeignKey(nameof(CreatedById))]
        public virtual User CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
    }
}
