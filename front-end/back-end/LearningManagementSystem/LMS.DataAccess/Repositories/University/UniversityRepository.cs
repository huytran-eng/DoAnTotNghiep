using LMS.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Repositories
{
    public class UniversityRepositoryy : BaseRepository<University>, IUniversityRepository
    {
        public UniversityRepositoryy(AppDbContext context) : base(context)
        {
        }
    }
}
