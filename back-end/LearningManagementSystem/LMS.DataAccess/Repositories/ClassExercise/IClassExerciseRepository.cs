using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface IClassExerciseRepository : IBaseRepository<ClassExercise>
    {
        Task<ClassExercise> GetClassExerciseWithTestCasesByIdAsync(Guid Id);
    }

}
