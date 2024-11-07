using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core.Models;
using LMS.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }


        public Task<UserDTO> LoginAsync(string username, string password)
        {
            throw new NotImplementedException();
        }

        public async Task<UserDTO> RegisterAsync(UserDTO userDTO)
        {
            var existingUser = await _userRepository.FindAsync(u => u.Username == userDTO.Username);
            if (existingUser != null)
            {
                throw new InvalidOperationException("Username is already taken.");
            }

            using var hmac = new HMACSHA512();
            var user = new User
            {
                Username = userDTO.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDTO.Password)),
                PasswordSalt = hmac.Key,
                Address = userDTO.Address,
                Email = userDTO.Email,
                Name = userDTO.Name,
                Note = "",
                Position = "Admin",
                Phone = userDTO.Phone

            };
         
            await _userRepository.AddAsync(user);
            await _userRepository.SaveAsync();

            return new UserDTO
            {
                Username = user.Username,
            };
        }
    }
}
