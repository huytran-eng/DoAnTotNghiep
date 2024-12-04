using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class SubjectProgrammingLanguageRepository : BaseRepository<SubjectProgrammingLanguage>, ISubjectProgrammingLanguageRepository
    {
        public SubjectProgrammingLanguageRepository(AppDbContext context) : base(context)
        {
        }
        public override async Task<SubjectProgrammingLanguage> GetByIdAsync(Guid id)
        {
            return await _context.SubjectProgrammingLanguages
                .Include(spl => spl.ProgrammingLanguage) // Eagerly load the related ProgrammingLanguage
                .FirstOrDefaultAsync(spl => spl.Id == id);
        }
    }
}
