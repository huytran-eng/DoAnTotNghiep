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
            base.OnModelCreating(modelBuilder);

            // seed admin user data
            using var hmac = new HMACSHA512();
            var adminUser = new User
            {
                Id = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                Username = "admin",
                Name = "Admin User",
                Email = "k.huytr4n@gmail.com",
                Address = "123 Admin St",
                Phone = "1234567890",
                Position = PositionEnum.Admin,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("password")),
                PasswordSalt = hmac.Key,
                BirthDate = new DateTime(1990, 7, 26)
            };
            modelBuilder.Entity<User>().HasData(adminUser);

            // Seed teacher user data
            var teachers = new List<User>();
            using var hmac2 = new HMACSHA512();

            teachers.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = "teacher1",
                Name = "Nguyen Van A",
                Email = "nguyenvana@university.edu",
                Address = "100 Le Loi St",
                Phone = "0123456789",
                Position = PositionEnum.Teacher,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("password1")),
                PasswordSalt = hmac.Key,
                BirthDate = new DateTime(1985, 1, 15)
            });
            teachers.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = "teacher2",
                Name = "Tran Thi B",
                Email = "tranthib@university.edu",
                Address = "200 Tran Hung Dao St",
                Phone = "0987654321",
                Position = PositionEnum.Teacher,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("password2")),
                PasswordSalt = hmac.Key,
                BirthDate = new DateTime(1980, 5, 10)
            });
            teachers.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = "teacher3",
                Name = "Pham Van C",
                Email = "phamvanc@university.edu",
                Address = "300 Nguyen Hue St",
                Phone = "0912345678",
                Position = PositionEnum.Teacher,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("password3")),
                PasswordSalt = hmac.Key,
                BirthDate = new DateTime(1979, 7, 24)
            });
            teachers.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = "teacher4",
                Name = "Le Thi D",
                Email = "lethid@university.edu",
                Address = "400 Hai Ba Trung St",
                Phone = "0943216789",
                Position = PositionEnum.Teacher,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("password4")),
                PasswordSalt = hmac.Key,
                BirthDate = new DateTime(1987, 9, 5)
            });
            teachers.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = "teacher5",
                Name = "Bui Van E",
                Email = "buivane@university.edu",
                Address = "500 Ba Trieu St",
                Phone = "0934567891",
                Position = PositionEnum.Teacher,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("password5")),
                PasswordSalt = hmac.Key,
                BirthDate = new DateTime(1983, 12, 12)
            });
            teachers.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = "teacher6",
                Name = "Hoang Thi F",
                Email = "hoangthif@university.edu",
                Address = "600 Vo Thi Sau St",
                Phone = "0923456782",
                Position = PositionEnum.Teacher,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("password6")),
                PasswordSalt = hmac.Key,
                BirthDate = new DateTime(1990, 3, 3)
            });
            teachers.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = "teacher7",
                Name = "Vo Van G",
                Email = "vovang@university.edu",
                Address = "700 Ly Thuong Kiet St",
                Phone = "0916782345",
                Position = PositionEnum.Teacher,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("password7")),
                PasswordSalt = hmac.Key,
                BirthDate = new DateTime(1986, 8, 20)
            });

            modelBuilder.Entity<User>().HasData(teachers);

            // Seed teacher data in Teacher table using the same IDs
            var teacherEntities = teachers.Select(user => new Teacher
            {
                Id = user.Id
            }).ToList();

            modelBuilder.Entity<Teacher>().HasData(teacherEntities);

            // seed data for university
            modelBuilder.Entity<University>().HasData(
               new University
               {
                   Id = Guid.Parse("1fc050f9-7cdf-464d-965e-22ea8b9d956c"),
                   Name = "Học viện Công nghệ Bưu Chính Viễn Thông",
                   Address = "96A Đường Trần Phú",
                   Phone = "024 3756 2186",
                   Description = "Học viện là một trong 7 trường Đại học đào tạo nguồn nhân lực An toàn thông tin trọng điểm Quốc gia.",
                   CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                   CreatedAt = DateTime.UtcNow
               });

            // Seed data for Department
            var departmentIds = new[]
            {
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
            };

            modelBuilder.Entity<Department>().HasData(
                new Department
                {
                    Id = departmentIds[0],
                    Name = "Khoa học Máy tính",
                    Description = "Nghiên cứu lý thuyết tính toán, giải thuật, và trí tuệ nhân tạo.",
                    UniversityId = Guid.Parse("1fc050f9-7cdf-464d-965e-22ea8b9d956c"),
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Department
                {
                    Id = departmentIds[1],
                    Name = "Kỹ thuật Phần mềm",
                    Description = "Tập trung vào phát triển phần mềm và quản lý dự án.",
                    UniversityId = Guid.Parse("1fc050f9-7cdf-464d-965e-22ea8b9d956c"),
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Department
                {
                    Id = departmentIds[2],
                    Name = "Hệ thống Thông tin",
                    Description = "Nghiên cứu các hệ thống quản lý thông tin và cơ sở dữ liệu.",
                    UniversityId = Guid.Parse("1fc050f9-7cdf-464d-965e-22ea8b9d956c"),
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed data for Subject
            var subjectIds = new[]
            {
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
            };
            modelBuilder.Entity<Subject>().HasData(
                   new Subject
                   {
                       Id = subjectIds[0],
                       Name = "Cấu trúc Dữ liệu và Giải thuật",
                       Credit = 3,
                       Description = "Học về cấu trúc dữ liệu và các giải thuật cơ bản.",
                       DepartmentId = departmentIds[0],
                       CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                       CreatedAt = DateTime.UtcNow
                   },
                   new Subject
                   {
                       Id = subjectIds[1],
                       Name = "Lập trình Python",
                       Credit = 3,
                       Description = "Học về lập trình Python và các ứng dụng của nó.",
                       DepartmentId = departmentIds[1], // Assigned to Software Engineering
                       CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                       CreatedAt = DateTime.UtcNow
                   },
                   new Subject
                   {
                       Id = subjectIds[2],
                       Name = "Lập trình C++",
                       Credit = 3,
                       Description = "Học các nguyên lý cơ bản của lập trình C++.",
                       DepartmentId = departmentIds[1], 
                       CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                       CreatedAt = DateTime.UtcNow
                   }
               );

            modelBuilder.Entity<Topic>().HasData(
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Danh sách liên kết",
                    Description = "Cấu trúc dữ liệu danh sách liên kết và các phép toán cơ bản.",
                    SubjectId = subjectIds[0],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Cây nhị phân",
                    Description = "Cấu trúc cây nhị phân và các ứng dụng của nó.",
                    SubjectId = subjectIds[0],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Tìm kiếm nhị phân",
                    Description = "Các thuật toán tìm kiếm nhị phân và ứng dụng trong việc tìm kiếm dữ liệu.",
                    SubjectId = subjectIds[0],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Con trỏ và mảng",
                    Description = "Các kiến thức về con trỏ và mảng trong C++.",
                    SubjectId = subjectIds[2],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Vào ra trên tệp",
                    Description = "Kiến thức về vào ra trên tệp trong C++.",
                    SubjectId = subjectIds[2],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Lập trình hàm",
                    Description = "Cách thức lập trình hàm trong C++ và các ứng dụng của nó.",
                    SubjectId = subjectIds[1],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Lập trình cơ bản với Python",
                    Description = "Giới thiệu về ngôn ngữ lập trình Python và các khái niệm cơ bản.",
                    SubjectId = subjectIds[2],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Xử lý chuỗi trong Python",
                    Description = "Các phương pháp xử lý chuỗi và dữ liệu trong Python.",
                    SubjectId = subjectIds[2],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Thư viện NumPy",
                    Description = "Sử dụng thư viện NumPy trong Python để xử lý mảng và tính toán khoa học.",
                    SubjectId = subjectIds[2],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Cấu trúc cơ bản trong C++",
                    Description = "Các kiểu dữ liệu cơ bản và cấu trúc trong C++.",
                    SubjectId = subjectIds[2],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                },
                new Topic
                {
                    Id = Guid.NewGuid(),
                    Name = "Lập trình đa luồng",
                    Description = "Cách thức lập trình đa luồng trong C++ và ứng dụng của nó.",
                    SubjectId = subjectIds[2],
                    CreatedById = Guid.Parse("cc851dbd-0819-45f6-9031-5bbfe1eb99f3"),
                    CreatedAt = DateTime.UtcNow
                }
            );

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
