package datn.codeexecutionapp.domain;

import lombok.Builder;

import java.util.List;

@Builder
public record ExecutionResponse(
        String message,
        boolean isSuccess,
        List<ExecutionResult> testCases
) {
}
