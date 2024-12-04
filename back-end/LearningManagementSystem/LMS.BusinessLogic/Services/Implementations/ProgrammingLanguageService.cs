using LMS.BusinessLogic.DTOs.ResponseDTO;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class ProgrammingLanguageService : IProgrammingLanguageService
    {

        private readonly IProgrammingLanguageRepository _programmingLanguageRepository;
        private readonly ISubjectRepository _subjectRepository;


        public ProgrammingLanguageService(IProgrammingLanguageRepository programmingLanguageRepository,ISubjectRepository subjectRepository)
        {
            _programmingLanguageRepository = programmingLanguageRepository;
            _subjectRepository = subjectRepository;
        }
        public async Task<CommonResult<List<SubjectProgrammingLanguageDTO>>> GetClassProgrammingLanguages(Guid classId)
        {
            try
            {
                var subject = await _subjectRepository.GetSubjectByClassIdAsync(classId);
                var spls = await _programmingLanguageRepository.GetSubjectProgrammingLanguages(subject.Id);
                if (spls == null || spls.Count < 1)
                {
                    return new CommonResult<List<SubjectProgrammingLanguageDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "no programming languge found"
                    };
                }

                var subjectProgrammingLanguagesDTO = spls.Select(pl => new SubjectProgrammingLanguageDTO
                {
                    Id = pl.Id,
                    Name = pl.ProgrammingLanguage.Name,
                }).ToList();

                return new CommonResult<List<SubjectProgrammingLanguageDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = subjectProgrammingLanguagesDTO
                };
            }
            catch (Exception ex)
            {
                return new CommonResult<List<SubjectProgrammingLanguageDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = "Error getting subject programming language" + ex.Message
                };
            }
        }

        public async Task<CommonResult<List<SubjectProgrammingLanguageDTO>>> GetSubjectProgrammingLanguages(Guid subjectId)
        {
            try
            {
                var spls = await _programmingLanguageRepository.GetSubjectProgrammingLanguages(subjectId);
                if (spls == null || spls.Count < 1)
                {
                    return new CommonResult<List<SubjectProgrammingLanguageDTO>>
                    {
                        IsSuccess = false,
                        Code = 404,
                        Message = "no programming languge found"
                    };
                }

                var subjectProgrammingLanguagesDTO = spls.Select(pl => new SubjectProgrammingLanguageDTO
                {
                    Id = pl.Id,
                    Name = pl.ProgrammingLanguage.Name,
                }).ToList();

                return new CommonResult<List<SubjectProgrammingLanguageDTO>>
                {
                    IsSuccess = true,
                    Code = 200,
                    Data = subjectProgrammingLanguagesDTO
                };
            }
            catch (Exception ex)
            {
                return new CommonResult<List<SubjectProgrammingLanguageDTO>>
                {
                    IsSuccess = false,
                    Code = 500,
                    Message = "Error getting subject programming language" + ex.Message
                };
            }
        }
    }
}
