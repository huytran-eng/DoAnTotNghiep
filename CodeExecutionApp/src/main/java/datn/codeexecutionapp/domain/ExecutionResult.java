package datn.codeexecutionapp.domain;

public record ExecutionResult(
        String output,
        String error,
        long executionTime,
        long memoryUsed,
        boolean success
) {}
