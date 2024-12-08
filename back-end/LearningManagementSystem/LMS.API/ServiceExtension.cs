using LMS.BusinessLogic.Services.Implementations;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.DataAccess.Repositories;
using OfficeOpenXml;
using System.Net.Security;

namespace LMS.API
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            // Register repositories
            services.AddScoped<IClassRepository, ClassRepository>();
            services.AddScoped<IExerciseRepository, ExerciseRepository>();
            services.AddScoped<ISubjectProgrammingLanguageRepository, SubjectProgrammingLanguageRepository>();
            services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<ITeacherRepository, TeacherRepository>();
            services.AddScoped<ITestCaseRepository, TestCaseRepository>();
            services.AddScoped<ITopicRepository, TopicRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ISubjectRepository, SubjectRepository>();
            services.AddScoped<IClassStudyMaterialRepository, ClassStudyMaterialRepository>();
            services.AddScoped<ISubjectExerciseRepository, SubjectExerciseRepository>();
            services.AddScoped<IClassTopicRepository, ClassTopicRepository>();
            services.AddScoped<IClassExerciseRepository, ClassExerciseRepository>();
            services.AddScoped<IProgrammingLanguageRepository, ProgrammingLanguageRepository>();
            services.AddScoped<IDepartmentRepository, DepartmentRepository>();
            services.AddScoped<IStudentSubmissonRepository, StudentSubmissionRepository>();


            // Register services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IStudentService, StudentService>();
            services.AddScoped<IClassService, ClassService>();
            services.AddScoped<IExerciseService, ExerciseService>();
            services.AddScoped<ISubjectService, SubjectService>();
            services.AddScoped<ITeacherService, TeacherService>();
            services.AddScoped<IProgrammingLanguageService, ProgrammingLanguageService>();
            services.AddScoped<ISubmissionService, SubmissionService>();
            services.AddScoped<IDepartmentService, DepartmentService>();


            return services;
        }
    }
}
