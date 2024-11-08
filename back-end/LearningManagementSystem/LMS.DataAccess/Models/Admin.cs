using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.DataAccess.Models
{
    public class Admin 
    {
        [Key, ForeignKey("User")]
        public Guid Id { get; set; }
        public virtual User User { get; set; }
    }
}
