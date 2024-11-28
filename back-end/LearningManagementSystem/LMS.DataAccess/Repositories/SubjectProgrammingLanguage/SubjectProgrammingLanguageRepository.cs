using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public class SubjectProgrammingLanguageRepository :BaseRepository<SubjectProgrammingLanguage>, ISubjectProgrammingLanguageRepository
    {
        public SubjectProgrammingLanguageRepository(AppDbContext context) : base(context)
        {
        }
    }
}
