using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.DataAccess.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly IClassService _classService;

        public ClassController(IClassService classService)
        {
            _classService = classService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateClass(CreateClassRequest request)
        {

            // Validate teacher and subject
            var teacher = await _context.Teachers.FindAsync(request.TeacherId);
            if (teacher == null)
                return BadRequest("Teacher not found");

            var subject = await _context.Subjects.FindAsync(request.SubjectId);
            if (subject == null)
                return BadRequest("Subject not found");

            // Create new class
            var newClass = new Class
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TeacherId = request.TeacherId,
                SubjectId = request.SubjectId,
                StudentClasses = new List<StudentClass>()
            };

            // Add students to the class
            foreach (var studentId in request.StudentIds)
            {
                var student = await _context.Students.FindAsync(studentId);
                if (student == null)
                    return BadRequest($"Student with ID {studentId} not found");

                newClass.StudentClasses.Add(new StudentClass
                {
                    StudentId = studentId
                });
            }

            // Save the new class to the database
            _context.Classes.Add(newClass);
            await _context.SaveChangesAsync();

            return Ok("Class created successfully");
        }
    }
}
