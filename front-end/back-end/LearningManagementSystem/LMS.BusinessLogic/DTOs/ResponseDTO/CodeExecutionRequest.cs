namespace LMS.BusinessLogic.DTOs.ResponseDTO
{
    public class CodeExecutionRequest
    {
        public string Code { get; set; }
        public string Language { get; set; }
        public IEnumerable<TestCasePayload> TestCases { get; set; }
    }

    public class TestCasePayload
    {
        public string Input { get; set; }
        public string ExpectedOutput { get; set; }
    }
}


