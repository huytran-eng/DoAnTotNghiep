using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.DTOs
{
    public class ClassDetailDTO
    {
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string TeacherName { get; set; }
        public string SubjectName { get; set; }
        public int NumberOfStudent { get; set; }
        public List<StudentDTO> Students { get; set; } = new();
        public List<ClassExerciseDTO> Exercises { get; set; } = new();
        public List<ClassStudyMaterialDTO> StudyMaterials { get; set; } = new();
    }


}
