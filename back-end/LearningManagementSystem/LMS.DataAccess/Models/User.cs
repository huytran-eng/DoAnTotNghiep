using LMS.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public byte[] PasswordHash { get; set; }
        [Required]
        public byte[] PasswordSalt { get; set; }
        [Required]
        public string Name { get; set; }
        public DateTime? BirthDate { get; set; }
        [Required]
        public string Email { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string? Note { get; set; }
        public PositionEnum Position { get; set; }
    }
}
