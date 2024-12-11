using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public interface IStudentSubmissonRepository : IBaseRepository<StudentSubmission>
    {
        Task<IEnumerable<StudentSubmission>> GetSubmissionsByExerciseAndStudentAsync(Guid exerciseId, Guid studentId);
        Task<IEnumerable<StudentSubmission>> GetSubmissionsByStudentIdAsync(Guid studentId);
        Task<IEnumerable<StudentSubmission>> GetSubmissionsByStudentIdAndClassIdAsync(Guid studentId, Guid classId);
    }
}
