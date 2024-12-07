using LMS.BusinessLogic.DTOs.ResponseDTO;

namespace LMS.BusinessLogic.DTOs.RequestDTO
{
    public class CreateSubjectDTO
    {
        public string Name { get; set; }
        public int Credit { get; set; }
        public string Description { get; set; }
        public Guid DepartmentId { get; set; }

        public List<CreateSubjectTopicDTO> Topics { get; set; }
        public List<Guid> ProgrammingLanguageIds { get; set; }
    }

    public class CreateSubjectTopicDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
