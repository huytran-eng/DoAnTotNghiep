using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface ISubjectExerciseRepository : IBaseRepository<SubjectExercise>
    {
        Task<IEnumerable<SubjectExercise>> FindBySubjectAsync(Guid subjectId);
        //Task<IEnumerable<SubjectExercise>> GetSubjectExercisesByTopicIdAsync(Guid topicId);
    }

}
