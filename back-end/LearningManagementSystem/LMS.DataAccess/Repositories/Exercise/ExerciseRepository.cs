using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public class ExerciseRepository: BaseRepository<Exercise>, IExerciseRepository
    {
        public ExerciseRepository(AppDbContext context) : base(context)
        {
        }
    }
}
