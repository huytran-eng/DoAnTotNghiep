/* eslint-disable react/prop-types */
import { getDifficulty } from "../../util/getDifficulty";

export default function ProblemDescription(props) {
  const problem = props.problem;
  if (!problem) {
    // If problem is null or undefined, show loading message
    return <p>Đang tải dữ liệu...</p>;
  }
  return (
    <div className="space-y-4 px-4 my-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{problem.title}</h1>
        <span
          className={`px-3 py-1 rounded text-sm ${
            problem.difficulty === 1
              ? "bg-green-100 text-green-800 font-medium"
              : problem.difficulty === 2
              ? "bg-yellow-100 text-yellow-800 font-medium"
              : "bg-red-100 text-red-800 font-medium"
          }`}
        >
          {getDifficulty(problem.difficulty)}
        </span>
      </div>

      <div className="prose max-w-none font-system">
        <div dangerouslySetInnerHTML={{ __html: problem.description }} />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold">Ví dụ:</h3>
        {problem.testCases.map((testCase, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded">
            <div className="mb-2">
              <strong>Input:</strong>
              <div className="whitespace-pre-wrap">{testCase.input}</div>
            </div>
            <div className="mb-2">
              <strong>Output:</strong>
              <div className="whitespace-pre-wrap">
                {testCase.expectedOutput}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-bold">Yêu cầu:</h3>
        <ul className="list-disc pl-5">
          {problem.requirements.split("\n").map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
