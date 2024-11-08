using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Models
{
    public class ClassExercise
    {
        public Guid Id { get; set; }
        public int ClassTopicOpenId { get; set; }
        [ForeignKey("ClassTopicOpenId")]
        public virtual ClassTopicOpen ClassTopicOpen { get; set; }  
        public int SubjectExerciseId { get; set; }
        [ForeignKey("SubjectExerciseId")]
        public virtual SubjectExercise SubjectExercise { get; set; }


    }
}
