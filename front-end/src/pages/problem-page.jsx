import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCodeEditor } from "../hooks/useCodeEditor";
import ProblemDescription from "../components/problem/description";
import CodeEditor from "../components/problem/code-editor";
import HeaderProblem from "../components/problem/header";
import axios from "axios";
import LanguageSelector from "../components/problem/language-selector";

export default function ProblemPage() {
  const { problemId } = useParams();
  const [activeTab, setActiveTab] = useState("description");

  //   const { data: problem, isLoading } = useQuery({
  //     queryKey: ['problem', problemId],
  //     queryFn: () => fetchProblem(problemId as string), // Implement this function to fetch problem data
  //   });
  const problem = {
    title: "Kiểm tra chuỗi Palindrome",
    description:
      "Một chuỗi Palindrome là chuỗi mà khi đọc từ trái qua phải hoặc từ phải qua trái, " +
      "nội dung của chuỗi vẫn không thay đổi. Ví dụ, chuỗi 'madam' hoặc 'racecar' là Palindrome, " +
      "nhưng chuỗi 'hello' thì không. Trong bài toán này, bạn cần viết chương trình kiểm tra " +
      "một chuỗi đầu vào và xác định xem chuỗi đó có phải là Palindrome hay không. " +
      "Lưu ý rằng bạn cần loại bỏ các ký tự không hợp lệ (khoảng trắng, dấu câu) " +
      "và không phân biệt chữ hoa chữ thường trước khi thực hiện kiểm tra.",

    requirements:
      "Input: Một chuỗi ký tự, có thể chứa chữ cái, số, khoảng trắng, và các ký tự đặc biệt.\n" +
      "Output: Trả về 'true' nếu chuỗi là Palindrome, ngược lại trả về 'false'.\n" +
      "Không phân biệt chữ hoa và chữ thường.\n" +
      "Loại bỏ tất cả các ký tự không phải là chữ cái hoặc số (bao gồm khoảng trắng, dấu câu và ký tự đặc biệt).\n" +
      "Loại bỏ tất cả các ký tự không phải là chữ cái hoặc số (bao gồm khoảng trắng, dấu câu và ký tự đặc biệt).\n" +
      "Loại bỏ tất cả các ký tự không phải là chữ cái hoặc số (bao gồm khoảng trắng, dấu câu và ký tự đặc biệt).\n" +
      "Loại bỏ tất cả các ký tự không phải là chữ cái hoặc số (bao gồm khoảng trắng, dấu câu và ký tự đặc biệt).\n" +
      "Loại bỏ tất cả các ký tự không phải là chữ cái hoặc số (bao gồm khoảng trắng, dấu câu và ký tự đặc biệt).\n" +
      "Loại bỏ tất cả các ký tự không phải là chữ cái hoặc số (bao gồm khoảng trắng, dấu câu và ký tự đặc biệt).\n" +
      "Đảm bảo chương trình xử lý được chuỗi có độ dài tối đa 1000 ký tự.",

    difficulty: 2, // Mức độ khó: trung bình
    timeLimit: 1000, // Giới hạn thời gian: 1000ms
    spaceLimit: 128, // Giới hạn bộ nhớ: 128MB

    testCases: [
      {
        input: '"A man, a plan, a canal: Panama"',
        expectedOutput: "true",
        explanation:
          "Chuỗi đầu vào chứa ký tự chữ cái, khoảng trắng, và dấu câu. Sau khi loại bỏ ký tự không hợp lệ " +
          "và chuyển tất cả sang chữ thường, chuỗi còn lại là 'amanaplanacanalpanama'. " +
          "Chuỗi này đọc xuôi và đọc ngược giống nhau nên kết quả là 'true'.",
      },
      {
        input: '"No lemon, no melon"',
        expectedOutput: "true",
        explanation:
          "Chuỗi đầu vào chứa ký tự chữ cái, khoảng trắng, và dấu câu. Sau khi xử lý, " +
          "chuỗi còn lại là 'nolemonnomelon'. Đây là một Palindrome nên kết quả là 'true'.",
      },
      {
        input: '"Hello, World!"',
        expectedOutput: "false",
        explanation:
          "Chuỗi đầu vào sau khi loại bỏ ký tự không hợp lệ là 'helloworld'. " +
          "Chuỗi này không giống nhau khi đọc xuôi và đọc ngược nên kết quả là 'false'.",
      },
    ],
  };

  const { code, language, isRunning, output, setCode, setLanguage } =
    useCodeEditor();
  const runCode = async () => {
    try {
      const testCases = [
        {
          input:
            "2\n5 6 2\n0 1 2\n1 2 3\n2 3 4\n3 4 5\n0 3 10\n1 3 8\n0 4\n2 4",
          expectedOutput:
            "Case #1:\nShortest distance: 11\nPath: 0 -> 1 -> 2 -> 3 -> 4\nShortest distance: 9\nPath: 2 -> 3 -> 4",
        },
        {
          input: "1\n3 2 3\n0 1 5\n1 2 3\n0 2\n2 0\n1 2",
          expectedOutput:
            "Case #1:\nShortest distance: 8\nPath: 0 -> 1 -> 2\nShortest distance: 8\nPath: 2 -> 1 -> 0\nShortest distance: 3\nPath: 1 -> 2",
        },
        {
          input: "1\n3 2 3\n0 1 5\n1 2 3\n0 2\n2 0\n1 2",
          expectedOutput:
            "Case #1:\nShortest distance: 8\nPath: 0 -> 1 -> 2\nShortest distance: 8\nPath: 2 -> 1 -> 0\nShortest distance: 3\nPath: 1 -> 2",
        },
      ];
      const response = await axios.post("http://localhost:8080/api/execute", {
        code,
        language,
        testCases,
      });

      if (!response) {
        throw new Error("Execution failed");
      }
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Execution failed"
      );
    }
  };
  //   if (isLoading) return <div>Loading...</div>;

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden">
      <HeaderProblem />
      <div className=" flex-1 max-h-[calc(100vh-48px)] grid grid-cols-2 gap-2 p-3 bg-[rgb(240_240_240_/0.5)]">
        {/* Left Panel */}
        <div className="border flex flex-col border-gray-300 rounded-lg bg-white max-h-[calc(100vh-64px)]">
          <div className="flex space-x-4 mb-4 bg-[#fafafa] rounded-t-lg shadow-sm">
            <button
              className={`px-4 py-2 rounded flex justify-center items-center w-[100px] text-sm ${
                activeTab === "description" ? "font-medium" : "opacity-40 "
              }`}
              onClick={() => setActiveTab("description")}
            >
              <svg
                className="size-4 mr-2 text-blue-500"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="memo"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  fill="currentColor"
                  d="M64 48c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64zM0 64C0 28.7 28.7 0 64 0H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm120 64H264c13.3 0 24 10.7 24 24s-10.7 24-24 24H120c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 96H264c13.3 0 24 10.7 24 24s-10.7 24-24 24H120c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 96h48c13.3 0 24 10.7 24 24s-10.7 24-24 24H120c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
                ></path>
              </svg>
              Mô tả
            </button>
            <button
              className={`px-4 py-2 rounded flex justify-center items-center w-[140px] text-sm ${
                activeTab === "submissions" ? "font-medium" : "opacity-40 "
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              <svg
                className="size-4 mr-2 text-blue-500"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="clock-rotate-left"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M48 106.7V56c0-13.3-10.7-24-24-24S0 42.7 0 56V168c0 13.3 10.7 24 24 24H136c13.3 0 24-10.7 24-24s-10.7-24-24-24H80.7c37-57.8 101.7-96 175.3-96c114.9 0 208 93.1 208 208s-93.1 208-208 208c-42.5 0-81.9-12.7-114.7-34.5c-11-7.3-25.9-4.3-33.3 6.7s-4.3 25.9 6.7 33.3C155.2 496.4 203.8 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C170.3 0 94.4 42.1 48 106.7zM256 128c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z"
                ></path>
              </svg>
              Lịch sử nộp
            </button>
          </div>

          <div className="flex-1 w-full overflow-y-auto px-4 pt-0 pb-5">
            {activeTab === "description" && (
              <ProblemDescription problem={problem} />
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="border flex flex-col border-gray-300 rounded-lg bg-white max-h-[calc(100vh-64px)]">
          <div className="flex space-x-4 bg-[#fafafa] rounded-t-lg shadow-sm">
            <div
              className={`px-4 py-2 rounded flex justify-center items-center w-[100px] text-sm ${"font-medium"}`}
            >
              <svg
                className="size-4 mr-2 text-green-500"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="code"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path
                  fill="currentColor"
                  d="M399.1 1.1c-12.7-3.9-26.1 3.1-30 15.8l-144 464c-3.9 12.7 3.1 26.1 15.8 30s26.1-3.1 30-15.8l144-464c3.9-12.7-3.1-26.1-15.8-30zm71.4 118.5c-9.1 9.7-8.6 24.9 1.1 33.9L580.9 256 471.6 358.5c-9.7 9.1-10.2 24.3-1.1 33.9s24.3 10.2 33.9 1.1l128-120c4.8-4.5 7.6-10.9 7.6-17.5s-2.7-13-7.6-17.5l-128-120c-9.7-9.1-24.9-8.6-33.9 1.1zm-301 0c-9.1-9.7-24.3-10.2-33.9-1.1l-128 120C2.7 243 0 249.4 0 256s2.7 13 7.6 17.5l128 120c9.7 9.1 24.9 8.6 33.9-1.1s8.6-24.9-1.1-33.9L59.1 256 168.4 153.5c9.7-9.1 10.2-24.3 1.1-33.9z"
                ></path>
              </svg>
              Code
            </div>
          </div>

          <div className="flex h-8 items-center justify-between border-b p-3 text-[#0000008c] ">
            <div className="rounded hover:bg-[#0000000f] px-1">
              <LanguageSelector setLanguage={setLanguage} />
            </div>
          </div>

          <div className="flex-1">
            <CodeEditor value={code} onChange={setCode} language={language} />
          </div>

          {output && (
            <div className="h-32 border-t border-gray-300 p-4 overflow-y-auto">
              <pre>{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
