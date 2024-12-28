using LMS.BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Http;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _storageDirectory;

        public FileStorageService()
        {
            // The storage directory path inside the container (can also be configured via app settings or environment variables)
            _storageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");

            // Ensure the directory exists
            if (!Directory.Exists(_storageDirectory))
            {
                Directory.CreateDirectory(_storageDirectory);
            }
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded");

            // Generate a unique filename
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(_storageDirectory, fileName);

            // Upload the file to the storage directory
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return fileName; // Return the file name or relative path for future retrieval
        }
    }
}
