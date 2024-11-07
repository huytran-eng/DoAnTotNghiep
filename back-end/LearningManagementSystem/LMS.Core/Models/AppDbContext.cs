using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace LMS.Core.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext() { }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<ClassExercise> ClassExercises { get; set; }
        public DbSet<ClassStudyMaterial> ClassStudyMaterials { get; set; }
        public DbSet<ClassTopicOpen> ClassTopicOpens { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<ProgrammingLanguage> ProgrammingLanguages { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<StudentClass> StudentClasses { get; set; }
        public DbSet<StudentSubmission> StudentSubmissions { get; set; }
        public DbSet<StudyMaterial> StudyMaterials { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<SubjectExercise> SubjectExercises { get; set; }
        public DbSet<SubjectProgrammingLanguage> SubjectProgrammingLanguages { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<TestCase> TestCases { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<University> Universities { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var builder = new ConfigurationBuilder()
                              .SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            IConfigurationRoot configuration = builder.Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure any specific relationships, constraints, or seed data here
            // Example: modelBuilder.Entity<Class>().HasKey(c => c.Id);

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Admin>()
               .HasOne(a => a.User)
               .WithOne()
               .HasForeignKey<Admin>(a => a.Id)
               .IsRequired();

            modelBuilder.Entity<Class>()
               .HasOne(c => c.Teacher)
               .WithMany()
               .HasForeignKey(c => c.TeacherId)
               .IsRequired();

            modelBuilder.Entity<Class>()
                .HasOne(c => c.Subject)
                .WithMany()
                .HasForeignKey(c => c.SubjectId)
                .IsRequired();

            modelBuilder.Entity<ClassExercise>()
                .HasOne(ce => ce.ClassTopicOpen)
                .WithMany()
                .HasForeignKey(ce => ce.ClassTopicOpenId)
                .IsRequired();

            modelBuilder.Entity<ClassExercise>()
                .HasOne(ce => ce.SubjectExercise)
                .WithMany()
                .HasForeignKey(ce => ce.SubjectExerciseId)
                .IsRequired();

            modelBuilder.Entity<ClassStudyMaterial>()
               .HasOne(csm => csm.Class)
               .WithMany()
               .HasForeignKey(csm => csm.ClassId)
               .IsRequired()
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ClassStudyMaterial>()
                .HasOne(csm => csm.StudyMaterial)
                .WithMany()
                .HasForeignKey(csm => csm.StudyMaterialId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            modelBuilder.Entity<ClassTopicOpen>()
               .HasOne(cto => cto.Class)
               .WithMany()
               .HasForeignKey(cto => cto.ClassId)
               .IsRequired();

            modelBuilder.Entity<ClassTopicOpen>()
                .HasOne(cto => cto.Topic)
                .WithMany()
                .HasForeignKey(cto => cto.TopicId)
                .IsRequired();

            modelBuilder.Entity<TestCase>()
                .HasOne(tc => tc.CreatedBy)
                .WithMany()
                .HasForeignKey(tc => tc.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Department>()
                .HasOne(tc => tc.CreatedBy)
                .WithMany()
                .HasForeignKey(tc => tc.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Class>()
                .HasOne(tc => tc.CreatedBy)
                .WithMany()
                .HasForeignKey(tc => tc.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Exercise>()
                .HasOne(tc => tc.CreatedBy)
                .WithMany()
                .HasForeignKey(tc => tc.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Subject>()
                .HasOne(tc => tc.CreatedBy)
                .WithMany()
                .HasForeignKey(tc => tc.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Topic>()
                .HasOne(tc => tc.CreatedBy)
                .WithMany()
                .HasForeignKey(tc => tc.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<University>()
                .HasOne(tc => tc.CreatedBy)
                .WithMany()
                .HasForeignKey(tc => tc.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SubjectProgrammingLanguage>()
                .HasOne(tc => tc.CreatedBy)
                .WithMany()
                .HasForeignKey(tc => tc.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StudentClass>()
              .HasOne(sc => sc.Student)
              .WithMany()
              .HasForeignKey(sc => sc.StudentId)
              .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StudentClass>()
                .HasOne(sc => sc.Class)
                .WithMany()
                .HasForeignKey(sc => sc.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ClassTopicOpen>()
                .HasOne(cto => cto.Topic)
                .WithMany()
                .HasForeignKey(cto => cto.TopicId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ClassExercise>()
                  .HasOne(ce => ce.SubjectExercise)
                  .WithMany()
                  .HasForeignKey(ce => ce.SubjectExerciseId)
                  .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StudentSubmission>()
                .HasOne(ss => ss.Student)
                .WithMany()
                .HasForeignKey(ss => ss.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<StudentSubmission>()
               .HasOne(ss => ss.SubjectProgrammingLanguage)
               .WithMany()
               .HasForeignKey(ss => ss.SubjectProgrammingLanguageId)
               .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
