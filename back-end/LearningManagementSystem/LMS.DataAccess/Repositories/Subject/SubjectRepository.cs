using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DataAccess.Repositories
{
    public class SubjectRepository : BaseRepository<Subject>, ISubjectRepository
    {
        public SubjectRepository(AppDbContext context) : base(context)
        {
        }
        public override async Task<IEnumerable<Subject>> GetAllAsync()
        {
            return await _context.Subjects
               .Include(s => s.Department)
               .Include(s => s.Classes)
               .Include(s => s.Topics)
               .ToListAsync();
        }

        public override async Task<Subject> GetByIdAsync(Guid id)
        {
            return await _context.Subjects
                        .Include(subject => subject.Department)
                        .Include(subject => subject.Classes)   
                        .Include(subject => subject.SubjectProgrammingLanguages)
                        .ThenInclude(spl => spl.ProgrammingLanguage)
               .Include(s => s.Topics)
                        .FirstOrDefaultAsync(subject => subject.Id == id);
        }

        public async Task<IEnumerable<Subject>> GetSubjectsByStudentIdAsync(Guid studentId)
        {
            return await _context.StudentClasses
                .Where(sc => sc.StudentId == studentId)
                .Select(sc => sc.Class.Subject)
                .Include(s => s.Department)
                .Include(c => c.Classes)
                .Distinct() 
                .Include(s => s.Topics)
                .ToListAsync();
        }

        public async Task<Subject> GetSubjectByClassIdAsync(Guid classId)
        {
            return  await _context.Classes
                .Where(c => c.Id == classId)  
                .Select(c => c.Subject)      
                .FirstOrDefaultAsync();       

        }
    }
}
