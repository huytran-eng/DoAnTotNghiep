using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.DTOs.RequestDTO;
using LMS.BusinessLogic.DTOs.ResponseDTO;
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


        public async Task<CommonResult<LoginResponseDTO>> LoginAsync(LoginRequestDTO userLoginInfo)
        {
            var result = new CommonResult<LoginResponseDTO>();
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

            var userResponseDTO = new LoginResponseDTO()
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
            result.Data = userResponseDTO;

            return result;
        }

        public async Task<CommonResult<UserDTO>> GetUserInformationById(Guid userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return new CommonResult<UserDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User id not found"
                    };
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
                };

                return new CommonResult<UserDTO>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = "success",
                    Data = userDTO
                };
            }
            catch (Exception ex)
            {
                return new CommonResult<UserDTO>
                {
                    IsSuccess = true,
                    Code = 500,
                    Message = "Error getting user info " + ex.Message
                };
            }
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
