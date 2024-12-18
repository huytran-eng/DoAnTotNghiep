
namespace LMS.BusinessLogic.DTOs
{
    public class EditSubjectDTO
    {
        public string Name { get; set; }
        public int Credit { get; set; }
        public string Description { get; set; }
        public Guid DepartmentId { get; set; }

        public List<CreateSubjectTopicDTO> Topics { get; set; }
        public List<Guid> ProgrammingLanguageIds { get; set; }
    }

    public class EditSubjectTopicDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
