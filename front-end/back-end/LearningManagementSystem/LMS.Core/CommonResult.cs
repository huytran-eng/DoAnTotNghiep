namespace LMS.Core
{
    public class CommonResult<T>
    {
        public string Message { get; set; }

        public int Code { get; set; }

        public T Data { get; set; }

        public bool IsSuccess { get; set; }
    }
}
