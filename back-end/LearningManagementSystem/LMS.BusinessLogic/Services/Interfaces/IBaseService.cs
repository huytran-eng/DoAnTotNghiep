using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BusinessLogic.Services.Interfaces
{
    public interface IBaseService<DTO>
    {
        Task<IEnumerable<DTO>> GetAllAsync();
        Task<DTO> GetByIdAsync(int id);
        Task AddAsync(DTO entity);
        Task UpdateAsync(DTO entity);
        Task DeleteAsync(DTO entity);
    }
}
