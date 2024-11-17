using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Repositories
{
    public interface IBaseRepository<T> where T : class
    {
        // Get all entities
        Task<IEnumerable<T>> GetAllAsync();

        // Get entity by Id
        Task<T> GetByIdAsync(Guid id);

        // Get entity by expression
        Task<T> FindAsync(Expression<Func<T, bool>> expression);

        // Get list of entities by expression
        Task<IEnumerable<T>> FindListAsync(Expression<Func<T, bool>> expression);

        // Add a new entity
        Task AddAsync(T entity);

        // Update an entity
        Task UpdateAsync(T entity);

        // Delete an entity
        Task DeleteAsync(T entity);

        // Delete a range of entities
        Task DeleteRangeAsync(List<T> entities);

        // Save changes
        Task SaveAsync();

        // Detach entity
        Task DetachAsync(T entity);
    }
}
