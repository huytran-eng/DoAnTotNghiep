package datn.codeexecutionapp.service;

import datn.codeexecutionapp.domain.ExecutionRequest;
import datn.codeexecutionapp.domain.ExecutionResult;
import datn.codeexecutionapp.excutor.CodeExecutor;
import datn.codeexecutionapp.factory.CodeExecutorFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CodeExecutionService {
    private final CodeExecutorFactory executorFactory;

    public CodeExecutionService(CodeExecutorFactory executorFactory) {
        this.executorFactory = executorFactory;
    }

    public List<ExecutionResult> execute(ExecutionRequest request) {
        CodeExecutor executor = executorFactory.getExecutor(request.language());

        return request.testCases().stream()
                .map(testCase -> {
                    ExecutionResult result = executor.execute(request.code(), testCase.input());
                    return new ExecutionResult(
                            result.output(),
                            result.error(),
                            result.executionTime(),
                            result.memoryUsed(),
                            result.success() && result.output().equals(testCase.expectedOutput())
                    );
                })
                .collect(Collectors.toList());
    }
}
