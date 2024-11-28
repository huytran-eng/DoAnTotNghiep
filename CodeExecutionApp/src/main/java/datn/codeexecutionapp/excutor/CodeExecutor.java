package datn.codeexecutionapp.excutor;

import datn.codeexecutionapp.domain.ExecutionResult;

public interface CodeExecutor {
    String getLanguage();
    ExecutionResult execute(String code, String input);
}
