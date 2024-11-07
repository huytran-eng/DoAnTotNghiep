using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Core.Models
{
    public class Admin 
    {
        [Key, ForeignKey("User")]
        public int Id { get; set; }
        public virtual User User { get; set; }
    }
}
