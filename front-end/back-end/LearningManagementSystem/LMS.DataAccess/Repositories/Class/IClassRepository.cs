using LMS.DataAccess.Models;

namespace LMS.DataAccess.Repositories
{
    public  interface IClassRepository: IBaseRepository<Class>
    {
        Task<IEnumerable<Class>> GetClassesByTeacherIdAsync(Guid teacherId);
        Task<IEnumerable<Class>> GetClassesByStudentIdAsync(Guid studentId);
        Task<IEnumerable<Class>> GetClassesForStudent(Guid studentId);
        Task<IEnumerable<Class>> GetBySubjectIdAsync(Guid subjectId);

    }
}
