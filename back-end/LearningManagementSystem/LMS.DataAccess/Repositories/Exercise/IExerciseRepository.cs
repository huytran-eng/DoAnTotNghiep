using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface IExerciseRepository : IBaseRepository<Exercise>
    {
        Task<Exercise> GetByIdWithTestCasesAsync(Guid Id);
        Task<Exercise> GetExerciseWithTestCasesByClassExerciseIdAsync(Guid classExerciseId);

    }

}
