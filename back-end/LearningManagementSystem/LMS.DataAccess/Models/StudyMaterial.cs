using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Models
{
    public class StudyMaterial:BaseEntity
    {
        public string Title { get; set; }
        public string MaterialLink { get; set; }

        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]  
        public Subject Subject { get; set; }
        
    }
}
