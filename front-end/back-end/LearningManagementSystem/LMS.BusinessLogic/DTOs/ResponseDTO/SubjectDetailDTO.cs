using LMS.BusinessLogic.DTOs.ResponseDTO;

namespace LMS.BusinessLogic.DTOs
{
    public class SubjectDetailDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Credit { get; set; }
        public string DepartmentName { get; set; }
        public int NumberOfClasses { get; set; }
        public Guid DepartmentId { get; set; }
        public string Description { get; set; }
        public List<TopicDTO> Topics { get; set; }
        public List<SubjectProgrammingLanguageDTO> subjectProgrammingLanguageDTOs { get; set; }
    }
}
