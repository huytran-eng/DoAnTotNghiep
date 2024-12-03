import { useState } from "react";
import axios from "axios";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executeCode(code, language) {
  try {
    const testCases = [
      {
        input: "2\n5 6 2\n0 1 2\n1 2 3\n2 3 4\n3 4 5\n0 3 10\n1 3 8\n0 4\n2 4",
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

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Execution failed"
    );
  }
}

export const useCodeEditor = () => {
  const [state, setState] = useState({
    code: "\n \n \n \n \n \n \n \n \n",
    language: "java",
    isRunning: false,
    output: {},
  });

  const setCode = (newCode) => {
    setState((prev) => ({ ...prev, code: newCode }));
  };

  const setLanguage = (language) => {
    setState((prev) => ({ ...prev, language }));
  };

  const runCode = async () => {
    setState((prev) => ({ ...prev, isRunning: true }));
    try {
      const result = await executeCode(state.code, state.language);
      setState((prev) => ({ ...prev, output: result }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        output: error instanceof Error ? error.message : "Execution failed",
      }));
    } finally {
      setState((prev) => ({ ...prev, isRunning: false }));
    }
  };

  return {
    ...state,
    setCode,
    setLanguage,
    runCode,
  };
};
