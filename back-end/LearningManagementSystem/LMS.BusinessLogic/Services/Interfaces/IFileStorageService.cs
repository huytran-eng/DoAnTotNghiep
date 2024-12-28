using Microsoft.AspNetCore.Http;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(IFormFile file);
    }
}
