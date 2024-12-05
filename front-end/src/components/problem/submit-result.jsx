/* eslint-disable react/prop-types */
const SubmitResult = (props) => {
  const { output } = props;
  console.log(output);
  
  return (
    <div
      className={`flex flex-col min-h-[190px] max-h-[170px] bg-white rounded-lg mt-2 shadow-md  ${
        output.status === 0 ? "text-green-500" : "text-red-500"
      }`}
    >
      <div className="flex space-x-4 bg-[#fafafa] rounded-t-lg justify-between p-[2px] shadow-sm">
        <div
          className={`px-4 py-2 rounded flex  items-center w-[150px] text-sm font-medium text-black`}
        >
          <svg
            className="size-4 mr-2 text-green-500"
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="terminal"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path
              fill="currentColor"
              d="M6.3 72.2c-9-9.8-8.3-24.9 1.4-33.9s24.9-8.3 33.9 1.4l184 200c8.5 9.2 8.5 23.3 0 32.5l-184 200c-9 9.8-24.2 10.4-33.9 1.4s-10.4-24.2-1.4-33.9L175.4 256 6.3 72.2zM248 432H552c13.3 0 24 10.7 24 24s-10.7 24-24 24H248c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
            ></path>
          </svg>
          Kết quả
        </div>
        <div
          className={`font-medium items-center 
              whitespace-nowrap focus:outline-none 
              inline-flex relative select-none px-3 py-1.5 
              rounded ${Object.keys(output).length === 0 ? "hidden" : ""}`}
        >
          <span className="mr-3">
            {output.status === 0 ? "AC" : output.status === 1 ? "WA" : "RE"}
          </span>

        </div>
      </div>

      <pre className="text-left text-sm py-3 px-4">{output.message}</pre>
    </div>
  );
};

export default SubmitResult;
