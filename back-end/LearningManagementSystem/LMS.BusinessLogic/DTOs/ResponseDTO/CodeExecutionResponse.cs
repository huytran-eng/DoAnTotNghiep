namespace LMS.BusinessLogic.DTOs
{
    public class CodeExecutionResponse
    {
        public string Message { get; set; }  // The output from the code execution
        public bool IsSuccess { get; set; }  // Any errors encountered during execution (should be a boolean)

        public List<TestCaseExecutionResponse> TestCases { get; set; }  // The list of test case results
    }

    public class TestCaseExecutionResponse
    {
        public string Output { get; set; }        // The output from the code execution
        public string Error { get; set; }         // Any errors encountered during execution
        public int ExecutionTime { get; set; }    // Execution time in milliseconds
        public int MemoryUsed { get; set; }       // Memory used in kilobytes (if provided)
        public bool Success { get; set; }         // Indicates whether the test case passed or not
    }

}
