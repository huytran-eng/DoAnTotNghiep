namespace LMS.BusinessLogic.DTOs
{
    public class ClassTopicOpenListDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public ClassDTO ClassDTO { get; set; }
        public TopicDTO TopicDTO { get; set; }
        public List<ClassExerciseListDTO>  ClassExerciseListDTOs{get;set;}
    }
}
