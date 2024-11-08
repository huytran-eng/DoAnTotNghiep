using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Models
{
    public class ClassStudyMaterial
    {
        public Guid Id { get; set; }
        public DateTime OpenDate { get;set; }
        public int ClassId { get; set; }
        [ForeignKey("ClassId")]
        public Class Class  { get; set; }
        public int StudyMaterialId { get; set; }
        [ForeignKey("StudyMaterialId")]
        public StudyMaterial StudyMaterial { get; set; }
    }
}
