using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Models
{
    public class SubjectExercise
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public virtual Subject Subject { get; set; }
        public int ExerciseId { get; set; }
        [ForeignKey("ExerciseId")]
        public virtual Exercise Exercise { get; set; }
        public DateTime AddedDate { get; set; }
    }
}
