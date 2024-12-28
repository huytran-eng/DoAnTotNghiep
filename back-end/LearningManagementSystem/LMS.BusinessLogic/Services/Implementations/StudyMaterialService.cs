using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class StudyMaterialService : IStudyMaterialService
    {
        private readonly IStudyMaterialRepository _studyMaterialRepository;
        private readonly IUserRepository _userRepository;
        private readonly IClassStudyMaterialRepository _classStudyMaterialRepository;
        private readonly IClassRepository _classRepository;
        private readonly string _storagePath;

        public StudyMaterialService(
              IStudyMaterialRepository studyMaterialRepository,
              IUserRepository userRepository,
              IConfiguration configuration,
              IClassStudyMaterialRepository classStudyMaterialRepository,
              IClassRepository classRepository
            )
        {
            _studyMaterialRepository = studyMaterialRepository;
            _userRepository = userRepository;
            _classStudyMaterialRepository = classStudyMaterialRepository;
            _classRepository = classRepository;
            _storagePath = configuration["StoragePath"]
            ?? throw new InvalidOperationException("StoragePath is not configured.");
        }

        public async Task<CommonResult<StudyMaterialDTO>> CreateStudyMaterialAsync(CreateStudyMaterialDTO studyMaterialDTO, IFormFile file, Guid userId)
        {
            try
            {
                if (studyMaterialDTO == null || file == null)
                {
                    throw new ArgumentException("Study material data and file are required.");
                }

                // Generate a unique GUID for the study material
                var studyMaterialGuid = Guid.NewGuid();

                // Save the file with the GUID and the original file name
                var fileName = $"{studyMaterialGuid.ToString()}_{file.FileName}"; // Format the file name
                var filePath = Path.Combine(_storagePath, fileName);

                // Upload the file to the storage    directory
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                studyMaterialDTO.MaterialLink = fileName;

                var studyMaterial = new StudyMaterial
                {
                    Title = studyMaterialDTO.Title,
                    MaterialLink = fileName,
                    SubjectId = studyMaterialDTO.SubjectId,
                    CreatedAt = DateTime.UtcNow.AddHours(7),
                    CreatedById = userId
                };
                await _studyMaterialRepository.AddAsync(studyMaterial);
                await _studyMaterialRepository.SaveAsync();

                return new CommonResult<StudyMaterialDTO>()
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = $"Create class successfull"
                };
            }
            catch (Exception e)
            {
                return new CommonResult<StudyMaterialDTO>()
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error when creating subject study material {e}"
                };
            }
        }
        public async Task<CommonResult<List<StudyMaterialListDTO>>> GetStudyMaterialsForSubject(Guid subjectId, Guid userId)
        {
            try
            {
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<List<StudyMaterialListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                // Check user position
                if (currentUserInfo.Position != PositionEnum.Admin && currentUserInfo.Position != PositionEnum.Teacher)
                {
                    return new CommonResult<List<StudyMaterialListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Unauthorzied."
                    };
                }

                var studyMaterials = await _studyMaterialRepository.FindListAsync(sm => sm.SubjectId == subjectId && !sm.IsDeleted);

                if (studyMaterials == null || !studyMaterials.Any())
                {
                    return new CommonResult<List<StudyMaterialListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "No study materials found for the given subject."
                    };
                }

                var studyMaterialDTOs = studyMaterials.Select(sm => new StudyMaterialListDTO
                {
                    Id = sm.Id,
                    Title = sm.Title,
                    MaterialLink = sm.MaterialLink,
                    CreatedAt = sm.CreatedAt,
                }).ToList();

                return new CommonResult<List<StudyMaterialListDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = "Study materials retrieved successfully.",
                    Data = studyMaterialDTOs
                };
            }
            catch (Exception e)
            {
                return new CommonResult<List<StudyMaterialListDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"There's a problem fetching the exercise data for subject {e}"
                };
            }
        }


        public async Task<CommonResult<List<ClassStudyMaterialListDTO>>> GetClassStudyMaterials(Guid classId, Guid userId)
        {
            try
            {
                var currentUserInfo = await _userRepository.GetByIdAsync(userId);
                if (currentUserInfo == null)
                {
                    return new CommonResult<List<ClassStudyMaterialListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "User not found."
                    };
                }

                var existingClass = await _classRepository.GetByIdAsync(classId);
                if (existingClass == null)
                {
                    return new CommonResult<List<ClassStudyMaterialListDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Class not found."
                    };
                }

                List<ClassStudyMaterialListDTO> studyMaterialDTOs;

                if (currentUserInfo.Position == PositionEnum.Admin || currentUserInfo.Position == PositionEnum.Teacher)
                {
                    // Admin/Teacher: Return all subject study materials
                    var subjectStudyMaterials = await _studyMaterialRepository.FindListAsync(sm => sm.SubjectId == existingClass.SubjectId && !sm.IsDeleted);
                    if (!subjectStudyMaterials.Any())
                    {
                        return new CommonResult<List<ClassStudyMaterialListDTO>>
                        {
                            IsSuccess = false,
                            Code = 404,
                            Message = "No study materials found for the given subject."
                        };
                    }

                    var classStudyMaterials = await _classStudyMaterialRepository.FindListAsync(csm => csm.ClassId == classId && !csm.IsDeleted);

                    studyMaterialDTOs = subjectStudyMaterials.Select(sm => new ClassStudyMaterialListDTO
                    {
                        Id = sm.Id,
                        Title = sm.Title,
                        MaterialLink = sm.MaterialLink,
                        CreatedAt = sm.CreatedAt,
                        IsOpen = classStudyMaterials.Any(csm => csm.StudyMaterialId == sm.Id),
                        OpenDate = classStudyMaterials.FirstOrDefault(csm => csm.StudyMaterialId == sm.Id)?.OpenDate
                    }).ToList();
                }
                else
                {
                    // Student: Return only opened class study materials
                    var classStudyMaterials = await _classStudyMaterialRepository.GetByClassIdAsync(classId);
                    if (!classStudyMaterials.Any())
                    {
                        return new CommonResult<List<ClassStudyMaterialListDTO>>
                        {
                            IsSuccess = false,
                            Code = 404,
                            Message = "No opened study materials found for the class."
                        };
                    }

                    studyMaterialDTOs = classStudyMaterials.Select(csm => new ClassStudyMaterialListDTO
                    {
                        Id = csm.StudyMaterialId,
                        Title = csm.StudyMaterial.Title,
                        MaterialLink = csm.StudyMaterial.MaterialLink,
                        CreatedAt = csm.StudyMaterial.CreatedAt,
                        IsOpen = true, // Automatically true for opened materials
                        OpenDate = csm.OpenDate
                    }).ToList();
                }

                return new CommonResult<List<ClassStudyMaterialListDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Message = "Study materials retrieved successfully.",
                    Data = studyMaterialDTOs
                };
            }
            catch (Exception e)
            {
                return new CommonResult<List<ClassStudyMaterialListDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"There's a problem fetching the exercise data for subject {e}"
                };
            }
        }

        public async Task<CommonResult<ClassStudyMaterialListDTO>> ToggleStudyMaterialForClass(Guid classId, Guid studyMaterialId, Guid userId)
        {
            try
            {

                // Check if the class exists
                var exxistingClass = await _classRepository.GetByIdAsync(classId);
                if (exxistingClass == null)
                {
                    return new CommonResult<ClassStudyMaterialListDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Class not found."
                    };
                }

                // Check if the study material exists
                var studyMaterial = await _studyMaterialRepository.GetByIdAsync(studyMaterialId);
                if (studyMaterial == null)
                {
                    return new CommonResult<ClassStudyMaterialListDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Study material not found."
                    };
                }

                // Fetch existing class-study material relationship
                var existingClassStudyMaterial = await _classStudyMaterialRepository
                    .FindListAsync(csm => csm.ClassId == classId && csm.StudyMaterialId == studyMaterialId && !csm.IsDeleted);

                if (existingClassStudyMaterial.Any())
                {
                    // If relationship exists, toggle it (mark as deleted, "close" the study material for the class)
                    var csmToDelete = existingClassStudyMaterial.First();
                    csmToDelete.IsDeleted = true;
                    await _classStudyMaterialRepository.UpdateAsync(csmToDelete);
                    await _studyMaterialRepository.SaveAsync();

                    return new CommonResult<ClassStudyMaterialListDTO>
                    {
                        IsSuccess = true,
                        Code = 200,
                        Message = "Study material closed for the class successfully.",
                        Data = new ClassStudyMaterialListDTO
                        {
                            Id = csmToDelete.StudyMaterialId,
                            Title = studyMaterial.Title,
                            MaterialLink = studyMaterial.MaterialLink,
                            CreatedAt = studyMaterial.CreatedAt,
                            IsOpen = false
                        }
                    };
                }
                else
                {
                    // If relationship does not exist, create it (mark as open, link study material to class)
                    var newClassStudyMaterial = new ClassStudyMaterial
                    {
                        ClassId = classId,
                        StudyMaterialId = studyMaterialId,
                        OpenDate = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow.AddHours(7),
                        CreatedById = userId,
                        IsDeleted = false
                    };

                    await _classStudyMaterialRepository.AddAsync(newClassStudyMaterial);
                    await _studyMaterialRepository.SaveAsync();

                    return new CommonResult<ClassStudyMaterialListDTO>
                    {
                        IsSuccess = true,
                        Code = 200,
                        Message = "Study material opened for the class successfully.",
                        Data = new ClassStudyMaterialListDTO
                        {
                            Id = newClassStudyMaterial.StudyMaterialId,
                            Title = studyMaterial.Title,
                            MaterialLink = studyMaterial.MaterialLink,
                            CreatedAt = studyMaterial.CreatedAt,
                            IsOpen = true
                        }
                    };
                }
            }
            catch (Exception e)
            {
                return new CommonResult<ClassStudyMaterialListDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"An error occurred while toggling the study material: {e.Message}"
                };
            }
        }



        public async Task<CommonResult<DownloadStudyMaterialDTO>> DownloadStudyMaterialAsync(Guid studyMaterialId)
        {
            try
            {
                // Retrieve the study material from the repository
                var studyMaterial = await _studyMaterialRepository.GetByIdAsync(studyMaterialId);

                if (studyMaterial == null || studyMaterial.IsDeleted)
                {
                    return new CommonResult<DownloadStudyMaterialDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "Study material not found."
                    };
                }

                // Construct the full file path
                var filePath = Path.Combine(_storagePath, studyMaterial.MaterialLink);

                if (!File.Exists(filePath))
                {
                    return new CommonResult<DownloadStudyMaterialDTO>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "File not found on the server."
                    };
                }

                var fileExtension = Path.GetExtension(filePath).ToLower();

                // Determine the ContentType
                string contentType = fileExtension switch
                {
                    ".pdf" => "application/pdf",
                    ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ".doc" => "application/msword",
                    _ => throw new NotSupportedException("Unsupported file type.")
                };

                // Read the file bytes
                var fileBytes = await File.ReadAllBytesAsync(filePath);

                return new CommonResult<DownloadStudyMaterialDTO>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = new DownloadStudyMaterialDTO
                    {
                        FileBytes = fileBytes,
                        ContentType = contentType, // Adjust based on your use case
                        FileName = Path.GetFileName(filePath)
                    },
                    Message = "File retrieved successfully."
                };
            }
            catch (Exception e)
            {
                return new CommonResult<DownloadStudyMaterialDTO>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = $"Error while downloading study material: {e.Message}"
                };
            }
        }
    }
}
