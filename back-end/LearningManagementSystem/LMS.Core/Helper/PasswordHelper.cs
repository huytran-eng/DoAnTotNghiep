using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Helper
{
    public class PasswordHelper
    {
        public static (byte[] passwordHash, byte[] passwordSalt) CreatePasswordHash(string password)
        {
            using var hmac = new HMACSHA512();
            var passwordSalt = hmac.Key;
            var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return (passwordHash, passwordSalt);
        }
    }
}
