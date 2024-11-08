using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
