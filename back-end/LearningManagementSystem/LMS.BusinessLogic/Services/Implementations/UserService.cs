using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.DataAccess.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        public UserService(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }


        public async Task<CommonResult<UserDTO>> LoginAsync(UserDTO userLoginInfo)
        {
            var result = new CommonResult<UserDTO>();
            var user = await _userRepository.FindAsync(u => u.Username == userLoginInfo.Username);

            if (user == null)
            {
                result.IsSuccess = false;
                result.Message = "User not found";
                result.Code = 404;
                return result;
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userLoginInfo.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    result.IsSuccess = false;
                    result.Message = "Invalid password";
                    result.Code = 401;
                    return result;
                }
            }

            var userDTO = new UserDTO()
            {
                Id = user.Id,
                Username = user.Username,
                Name = user.Username,
                BirthDate = user.BirthDate,
                Email = user.Email,
                Address = user.Address,
                Phone = user.Phone,
                Position = user.Position.ToString(),
                Token = _tokenService.CreateToken(user)
            };

            result.IsSuccess = true;
            result.Message = "Login successful";
            result.Code = 200;
            result.Data = userDTO;

            return result;
        }

        //public async Task<CommonResult<UserDTO>> RegisterAsync(UserDTO userDTO)
        //{
        //    var existingUser = await _userRepository.FindAsync(u => u.Username == userDTO.Username);
        //    if (existingUser != null)
        //    {
        //        throw new InvalidOperationException("Username is already taken.");
        //    }

        //    using var hmac = new HMACSHA512();
        //    var user = new User
        //    {
        //        Username = userDTO.Username,
        //        PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDTO.Password)),
        //        PasswordSalt = hmac.Key,
        //        Address = userDTO.Address,
        //        Email = userDTO.Email,
        //        Name = userDTO.Name,
        //        Note = "",
        //        Position = PositionEnum.Admin,
        //        Phone = userDTO.Phone

        //    };

        //    await _userRepository.AddAsync(user);
        //    await _userRepository.SaveAsync();

        //    return new UserDTO
        //    {
        //        Username = user.Username,
        //    };
        //}
    }
}
