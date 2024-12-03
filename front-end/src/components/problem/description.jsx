/* eslint-disable react/prop-types */
import { getDifficulty } from "../../util/getDifficulty";

export default function ProblemDescription(props) {
  const problem = props.problem;
  return (
    <div className="space-y-4 px-4 mt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
           {problem.title}
        </h1>
        <span className={`px-3 py-1 rounded text-sm ${
          problem.difficulty === 1 ? 'bg-green-100 text-green-800' :
          problem.difficulty === 2 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
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
            <p><strong>Input:</strong> {testCase.input}</p>
            <p><strong>Output:</strong> {testCase.expectedOutput}</p>        
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-bold">Yêu cầu:</h3>
        <ul className="list-disc pl-5">
          {problem.requirements.split('\n').map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}