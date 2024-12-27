using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.DataAccess.Models
{
    public class ClassStudyMaterial
    {
        public Guid Id { get; set; }
        public DateTime OpenDate { get;set; }
        public Guid ClassId { get; set; }
        [ForeignKey("ClassId")]
        public Class Class  { get; set; }
        public Guid StudyMaterialId { get; set; }
        [ForeignKey("StudyMaterialId")]
        public StudyMaterial StudyMaterial { get; set; }
    }
}
