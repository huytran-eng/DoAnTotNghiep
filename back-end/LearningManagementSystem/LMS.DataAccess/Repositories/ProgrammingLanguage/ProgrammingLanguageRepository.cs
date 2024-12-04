using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class ProgrammingLanguageRepository :BaseRepository<ProgrammingLanguage>, IProgrammingLanguageRepository
    {
        public ProgrammingLanguageRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<SubjectProgrammingLanguage>> GetSubjectProgrammingLanguages(Guid subjectId)
        {
            // Fetching the programming languages associated with the subject
            return  await _context.SubjectProgrammingLanguages
            .Where(spl => spl.SubjectId == subjectId)
            .Include(spl => spl.ProgrammingLanguage)
            .ToListAsync();

        }
    }
}
