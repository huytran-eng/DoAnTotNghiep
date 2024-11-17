using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.DTOs.RequestDTO
{
    public class AddExerciseToSubjectDto
    {
        public Guid SubjectId { get; set; }
        public Guid ExerciseId { get; set; }
        public Guid TopicId { get; set; }
    }
}
