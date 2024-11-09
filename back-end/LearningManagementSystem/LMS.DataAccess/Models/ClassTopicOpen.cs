using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Models
{
    public class ClassTopicOpen
    {
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid ClassId { get; set; }
        [ForeignKey("ClassId")]
        public virtual Class Class { get; set; }
        public Guid TopicId { get; set; }
        [ForeignKey("TopicId")]
        public virtual Topic Topic { get; set; }
    }
}
