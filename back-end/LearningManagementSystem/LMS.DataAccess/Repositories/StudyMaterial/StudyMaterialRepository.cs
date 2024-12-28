using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public class StudyMaterialRepository : BaseRepository<StudyMaterial>, IStudyMaterialRepository
    {
        public StudyMaterialRepository(AppDbContext context) : base(context)
        {
        }
    }
}
