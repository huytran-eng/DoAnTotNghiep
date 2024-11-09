using LMS.BusinessLogic.DTOs;
using LMS.BusinessLogic.Services.Interfaces;
using LMS.Core;
using LMS.Core.Enums;
using LMS.Core.Helper;
using LMS.DataAccess.Models;
using LMS.DataAccess.Repositories;
using Microsoft.VisualBasic;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace LMS.BusinessLogic.Services.Implementations
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IUserRepository _userRepository;

        public StudentService(IStudentRepository studentRepository, IUserRepository userRepository)
        {
            _studentRepository = studentRepository;
            _userRepository = userRepository;
        }

        public async Task<CommonResult<StudentDTO>> ImportStudents(Stream stream)
        {
            var students = new List<Student>();
            try
            {
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    var rowCount = worksheet.Dimension.Rows;

                    var expectedHeaders = new List<string>
                    {
                        "StudentId", "Student Name", "Birth Date", "Email",
                        "Address", "Phone"
                    };

                    // Read the first row headers
                    var actualHeaders = new List<string>();
                    for (int col = 1; col <= 6; col++)
                    {
                        actualHeaders.Add(worksheet.Cells[1, col].Text.Trim());
                    }

                    // Compare actual headers with expected headers
                    for (int i = 0; i < expectedHeaders.Count; i++)
                    {
                        if (!string.Equals(expectedHeaders[i], actualHeaders[i], StringComparison.OrdinalIgnoreCase))
                        {
                            return new CommonResult<StudentDTO>()
                            {
                                IsSuccess = false,
                                Code = 400,
                                Message = "The given file doesn't match the sample file"
                            };
                        }
                    }

                    if (rowCount < 2)
                    {
                        return new CommonResult<StudentDTO>()
                        {
                            IsSuccess = false,
                            Code = 400,
                            Message = "No student found"
                        };
                    }

                    var dateFormats = new[] { "dd/MM/yyyy", "d/M/yyyy" };
                    var errorMessages = new StringBuilder();
                    var hasError = false;

                    // Loop through every row of the excel file
                    for (int row = 2; row <= rowCount; row++)
                    {
                        // Validate student fields
                        var studentId = worksheet.Cells[row, 1].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentId))
                        {
                            errorMessages.AppendLine($"Student Id is required on line {row}.");
                            hasError = true;
                        }

                        var studentName = worksheet.Cells[row, 2].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentName))
                        {
                            errorMessages.AppendLine($"Student name is required on line {row}.");
                            hasError = true;
                        }

                        if (!DateTime.TryParseExact(worksheet.Cells[row, 3].Text, dateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime birthDate))
                        {
                            errorMessages.AppendLine($"Invalid birth date on line {row}.");
                            hasError = true;
                        }

                        var studentEmail = worksheet.Cells[row, 4].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentEmail))
                        {
                            errorMessages.AppendLine($"Student email is required on line {row}.");
                            hasError = true;
                        }

                        var studentAddress = worksheet.Cells[row, 5].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentAddress))
                        {
                            errorMessages.AppendLine($"Student address is required on line {row}.");
                            hasError = true;
                        }

                        var studentPhone = worksheet.Cells[row, 6].Text.Trim();
                        if (string.IsNullOrWhiteSpace(studentPhone))
                        {
                            errorMessages.AppendLine($"Student phone is required on line {row}.");
                            hasError = true;
                        }

                        if (hasError)
                            continue;

                        // Generate student password hash and salt based on student ID
                        var (hash, salt) = PasswordHelper.CreatePasswordHash(studentId.ToLower());

                        var currentUser = new User
                        {
                            Id = Guid.NewGuid(),
                            Username = studentName,
                            Name = studentName,
                            Email = studentEmail,
                            PasswordHash = hash,
                            PasswordSalt = salt,
                            Address = studentAddress,
                            Phone = studentPhone,
                            Position = PositionEnum.Student,
                            BirthDate = birthDate
                        };

                        var currentStudent = new Student
                        {
                            StudentId = studentId,
                            User = currentUser,
                        };

                        students.Add(currentStudent);
                    }

                    if (hasError)
                    {
                        return new CommonResult<StudentDTO>
                        {
                            IsSuccess = false,
                            Code = 400,
                            Message = errorMessages.ToString()
                        };
                    }

                    // Add students to the database
                    foreach (var student in students)
                    {
                        await _userRepository.AddAsync(student.User);
                        await _studentRepository.AddAsync(student);
                    }

                    await _studentRepository.SaveAsync();

                    return new CommonResult<StudentDTO>
                    {
                        IsSuccess = true,
                        Code = 200,
                        Message = "Students added successfully"
                    };
                }
            }
            catch (Exception ex)
            {
                return new CommonResult<StudentDTO>
                {
                    IsSuccess = true,
                    Code = 500,
                    Message = "Error reading excel file " + ex.Message
                };
            }
        }
    }
}
