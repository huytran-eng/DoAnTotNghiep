using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface IStudentSubmissonRepository : IBaseRepository<StudentSubmission>
    {
        Task<IEnumerable<StudentSubmission>> GetSubmissionsByExerciseAndStudentAsync(Guid exerciseId, Guid studentId);
    }
}
