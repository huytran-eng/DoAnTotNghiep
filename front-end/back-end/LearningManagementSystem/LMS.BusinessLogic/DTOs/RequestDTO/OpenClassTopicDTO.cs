using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.DTOs.RequestDTO
{
    public class OpenClassTopicDTO
    {
        public Guid ClassId { get; set; }
        public Guid TopicId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
