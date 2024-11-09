using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public class ProgrammingLanguageRepository :BaseRepository<ProgrammingLanguage>, IProgrammingLanguageRepository
    {
        public ProgrammingLanguageRepository(AppDbContext context) : base(context)
        {
        }
    }
}
