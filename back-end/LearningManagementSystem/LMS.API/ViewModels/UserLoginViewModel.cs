namespace LMS.API.ViewModels
{
    public class UserLoginViewModel
    {
        public required string UserName { get; set; }   
        public required string Password { get; set; }
        public DateTime? BirthDate { get; set; }
        public required string Name { get; set; }

        public required string Email { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Note { get; set; }
    }
}
