using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Models
{
    public class SubjectExercise
    {
        public Guid Id { get; set; }
        public Guid SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public virtual Subject Subject { get; set; }
        public Guid ExerciseId { get; set; }
        [ForeignKey("ExerciseId")]
        public virtual Exercise Exercise { get; set; }
        public DateTime AddedDate { get; set; }
    }
}
