using LMS.BusinessLogic.Services.Implementations;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.DataAccess.Repositories;
using OfficeOpenXml;

namespace LMS.API
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
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
            services.AddScoped<IStudyMaterialRepository, StudyMaterialRepository>();


            // Register services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IStudentService, StudentService>();
            services.AddScoped<IClassService, ClassService>();
            services.AddScoped<IExerciseService, ExerciseService>();
            services.AddScoped<ISubjectService, SubjectService>();
            services.AddScoped<ITeacherService, TeacherService>();
            services.AddScoped<IProgrammingLanguageService, ProgrammingLanguageService>();
            services.AddScoped<IStudentSubmissionService, StudentSubmissionService>();
            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<IStudyMaterialService, StudyMaterialService>();
            //var storagePath = configuration["StoragePath"];
            //if (string.IsNullOrEmpty(storagePath))
            //{
            //    throw new InvalidOperationException("StoragePath is not configured in environment variables.");
            //}
            //services.AddScoped<IStudyMaterialService>(provider =>
            //    new StudyMaterialService(
            //        provider.GetRequiredService<IStudyMaterialRepository>(),
            //        storagePath
            //    ));

            return services;
        }
    }
}
