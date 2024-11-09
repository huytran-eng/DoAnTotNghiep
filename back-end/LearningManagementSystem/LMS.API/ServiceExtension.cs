using LMS.BusinessLogic.Services.Implementations;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.DataAccess.Repositories;

namespace LMS.API
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Register repositories
            services.AddScoped<IClassRepository, ClassRepository>();
            services.AddScoped<IExerciseRepository, ExerciseRepository>();
            services.AddScoped<IProgrammingLanguageRepository, ProgrammingLanguageRepository>();
            services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<ITeacherRepository, TeacherRepository>();
            services.AddScoped<ITestCaseRepository, TestCaseRepository>();
            services.AddScoped<ITopicRepository, TopicRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            // Register services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
