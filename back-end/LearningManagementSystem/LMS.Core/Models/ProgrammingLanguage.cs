using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Models
{
    public class ProgrammingLanguage:BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
