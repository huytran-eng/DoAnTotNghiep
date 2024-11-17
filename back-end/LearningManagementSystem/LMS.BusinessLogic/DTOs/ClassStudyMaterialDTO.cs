using LMS.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.DTOs
{
    public class ClassStudyMaterialDTO
    {
        public Guid Id { get; set; }
        public DateTime OpenDate { get; set; }
        public string Title { get; set; }
        public string MaterialLink { get; set; }
    }
}
