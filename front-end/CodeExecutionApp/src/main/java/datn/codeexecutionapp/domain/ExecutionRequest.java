package datn.codeexecutionapp.domain;

import java.util.List;

public record ExecutionRequest(
        String code,
        String language,
        List<TestCase> testCases
) {}
