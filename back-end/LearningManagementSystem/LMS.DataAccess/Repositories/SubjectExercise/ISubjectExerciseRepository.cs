using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface ISubjectExerciseRepository : IBaseRepository<SubjectExercise>
    {
        Task<List<SubjectExercise>> FindBySubjectAsync(Guid subjectId);
    }

}
