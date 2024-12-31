using LMS.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;

namespace LMS.DataAccess.Models
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

        // vps
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Directly specify the connection string
            string connectionString = "Server=db;Database=LearningManagementSystem;User=sa;Password=M@tkh4umo1;Encrypt=false;TrustServerCertificate=true";

            optionsBuilder.UseSqlServer(connectionString);
            optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    // Directly specify the connection string
        //    string connectionString = "Server=DESKTOP-RKN1HKT\\MSSQLSERVER2022;Database=LearningManagementSystem;User=sa;Password=password;Encrypt=false";

        //    optionsBuilder.UseSqlServer(connectionString);
        //    optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
        //}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                entity.SetTableName(entity.DisplayName());
            }

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
                .WithMany(s => s.Classes)
                .HasForeignKey(c => c.SubjectId)
                .IsRequired();

            modelBuilder.Entity<Teacher>()
              .HasOne(t => t.Department)
              .WithMany(d => d.Teachers)
              .HasForeignKey(t => t.DepartmentId)
              .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ClassTopicOpen>()
               .HasOne(cto => cto.Class)
               .WithMany()
               .HasForeignKey(ce => ce.ClassId)
               .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ClassTopicOpen>()
              .HasOne(cto => cto.Topic)
              .WithMany()
              .HasForeignKey(ce => ce.TopicId)
              .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

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
               .OnDelete(DeleteBehavior.Restrict)
               .IsRequired();

            modelBuilder.Entity<ClassTopicOpen>()
                .HasOne(cto => cto.Topic)
                .WithMany()
                .HasForeignKey(cto => cto.TopicId)
                .OnDelete(DeleteBehavior.Restrict)
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
                .HasKey(sc => sc.Id);

            modelBuilder.Entity<StudentClass>()
                .HasOne(sc => sc.Student)
                .WithMany(s => s.StudentClasses)
                .HasForeignKey(sc => sc.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StudentClass>()
                .HasOne(sc => sc.Class)
                .WithMany(c => c.StudentClasses)
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
