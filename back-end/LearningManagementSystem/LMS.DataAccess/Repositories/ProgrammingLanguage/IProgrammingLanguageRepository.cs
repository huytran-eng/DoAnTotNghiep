using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface IProgrammingLanguageRepository  :IBaseRepository<ProgrammingLanguage>
    {
        Task<List<SubjectProgrammingLanguage>> GetSubjectProgrammingLanguages(Guid subjectId);
    }
}
