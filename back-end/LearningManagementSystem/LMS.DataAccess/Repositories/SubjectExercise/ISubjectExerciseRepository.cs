using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface ISubjectExerciseRepository : IBaseRepository<SubjectExercise>
    {
        Task<IEnumerable<SubjectExercise>> FindBySubjectAsync(Guid subjectId, Guid exerciseId);
        Task<IEnumerable<SubjectExercise>> GetSubjectExercisesByTopicIdAsync(Guid topicId);
    }

}
