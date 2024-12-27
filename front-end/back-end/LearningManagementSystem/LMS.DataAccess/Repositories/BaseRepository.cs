using LMS.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace LMS.DataAccess.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        private readonly DbSet<T> _dbSet;

        public BaseRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await Task.FromResult(_dbSet.Where(entity => EF.Property<bool>(entity, "IsDeleted") == false));
        }

        public virtual async Task<T> GetByIdAsync(Guid id)
        {
            return await _dbSet.FirstOrDefaultAsync(entity => EF.Property<Guid>(entity, "Id") == id && !EF.Property<bool>(entity, "IsDeleted"));
        }

        public virtual async Task<T> FindAsync(Expression<Func<T, bool>> expression)
        {
            return await _dbSet.FirstOrDefaultAsync(expression); 
        }

        public virtual async Task<IEnumerable<T>> FindListAsync(Expression<Func<T, bool>> expression)
        {
            return await Task.FromResult(_dbSet.Where(expression)); 
        }

        public virtual async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity); 
        }
        public virtual async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }
        public virtual async Task UpdateAsync(T entity)
        {
            _dbSet.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified; 
            await Task.CompletedTask; 
        }

        public virtual async Task DeleteAsync(T entity)
        {
            var property = typeof(T).GetProperty("IsDeleted");
            if (property != null)
            {
                property.SetValue(entity, true); // Set IsDeleted to true
                _dbSet.Update(entity); // Mark entity as updated
                await Task.CompletedTask; // Simulate async behavior
            }
            else
            {
                throw new InvalidOperationException("Entity does not have an IsDeleted property.");
            }
        }

        public virtual async Task SaveAsync()
        {
            await _context.SaveChangesAsync(); 
        }

        public virtual async Task DeleteRangeAsync(List<T> entities)
        {
            foreach (var entity in entities)
            {
                var property = typeof(T).GetProperty("IsDeleted");
                if (property != null)
                {
                    property.SetValue(entity, true); // Set IsDeleted to true for each entity
                    _dbSet.Update(entity); // Mark entity as updated
                }
                else
                {
                    throw new InvalidOperationException("Entity does not have an IsDeleted property.");
                }
            }

            await Task.CompletedTask; // Simulate async behavior
        }

        public virtual async Task DetachAsync(T entity)
        {
            _context.Entry(entity).State = EntityState.Detached; 
            await Task.CompletedTask; 
        }
    }
}
