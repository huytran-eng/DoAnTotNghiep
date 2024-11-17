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
            return await Task.FromResult(_dbSet);
        }

        public virtual async Task<T> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id); 
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

        public virtual async Task UpdateAsync(T entity)
        {
            _dbSet.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified; 
            await Task.CompletedTask; 
        }

        public virtual async Task DeleteAsync(T entity)
        {
            if (_context.Entry(entity).State == EntityState.Detached)
            {
                _dbSet.Attach(entity); 
            }
            _dbSet.Remove(entity); 
            await Task.CompletedTask; 
        }

        public virtual async Task SaveAsync()
        {
            await _context.SaveChangesAsync(); 
        }

        public virtual async Task DeleteRangeAsync(List<T> entities)
        {
            _dbSet.RemoveRange(entities);
            await Task.CompletedTask; 
        }

        public virtual async Task DetachAsync(T entity)
        {
            _context.Entry(entity).State = EntityState.Detached; 
            await Task.CompletedTask; 
        }
    }
}
