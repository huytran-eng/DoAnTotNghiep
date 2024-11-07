using LMS.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        private readonly AppDbContext _context;
        private readonly DbSet<T> _dbSet;

        public BaseRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public virtual async Task<IQueryable<T>> GetAllAsync()
        {
            return await Task.FromResult(_dbSet);
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id); // Use FindAsync for async lookup by ID.
        }

        public virtual async Task<T> FindAsync(Expression<Func<T, bool>> expression)
        {
            return await _dbSet.FirstOrDefaultAsync(expression); // Use FirstOrDefaultAsync to find entity asynchronously.
        }

        public virtual async Task<IQueryable<T>> FindListAsync(Expression<Func<T, bool>> expression)
        {
            return await Task.FromResult(_dbSet.Where(expression)); // Return filtered IQueryable wrapped in Task.
        }

        public virtual async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity); // Use AddAsync for asynchronous entity insertion.
        }

        public virtual async Task UpdateAsync(T entity)
        {
            _dbSet.Attach(entity); // Attach the entity to the context.
            _context.Entry(entity).State = EntityState.Modified; // Mark the entity as modified.
            await Task.CompletedTask; // No need to await anything for the update itself.
        }

        public virtual async Task DeleteAsync(T entity)
        {
            if (_context.Entry(entity).State == EntityState.Detached)
            {
                _dbSet.Attach(entity); // Attach entity if it is detached.
            }
            _dbSet.Remove(entity); // Remove entity from the DbSet.
            await Task.CompletedTask; // No need to await anything for the delete operation itself.
        }

        public virtual async Task SaveAsync()
        {
            await _context.SaveChangesAsync(); // Use SaveChangesAsync for async save operation.
        }

        public virtual async Task DeleteRangeAsync(List<T> entities)
        {
            _dbSet.RemoveRange(entities); // Remove the list of entities from the DbSet.
            await Task.CompletedTask; // No need to await anything for removing range itself.
        }

        public virtual async Task DetachAsync(T entity)
        {
            _context.Entry(entity).State = EntityState.Detached; // Detach the entity from the DbContext.
            await Task.CompletedTask; // No need to await anything for detach operation.
        }
    }
}
