using LMS.Core.Enums;
using LMS.DataAccess.Models;

namespace LMS.BusinessLogic.DTOs
{
    public class ClassExerciseListDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public Guid ExerciseId { get; set; }
        public DifficultyLevel Difficulty { get; set; }
        public int TimeLimit { get; set; } // Time limit in seconds
        public int SpaceLimit { get; set; } // Space limit in MB
        public int Status { get; set; }
    }
}
