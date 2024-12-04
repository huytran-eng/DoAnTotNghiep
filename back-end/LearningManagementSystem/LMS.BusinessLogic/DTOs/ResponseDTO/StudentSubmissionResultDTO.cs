namespace LMS.BusinessLogic.DTOs.ResponseDTO
{
    public class StudentSubmissionResultDTO
    {
        /// <summary>
        /// Status of the submission evaluation:
        /// 0 = All test cases passed,
        /// 1 = Some test cases failed,
        /// 2 = Error occurred during execution.
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// Message from the execution service or a custom error message.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// The number of test cases passed. If there's a compile or runtime error, this is set to 0.
        /// </summary>
        public int TestCases { get; set; }

        public int TotalTestCases { get; set; }
    }
}
