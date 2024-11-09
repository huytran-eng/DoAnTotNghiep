using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.DataAccess.Models
{
    public abstract class BaseEntity
    {
        [Key]
        public Guid Id { get; set; } 

        public Guid? UpdatedById { get; set; }
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey(nameof(UpdatedById))]
        public virtual User? UpdatedBy { get; set; }
        public Guid CreatedById { get; set; }
        public DateTime CreatedAt { get; set; }


        [ForeignKey(nameof(CreatedById))]
        public virtual User CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
    }
}
