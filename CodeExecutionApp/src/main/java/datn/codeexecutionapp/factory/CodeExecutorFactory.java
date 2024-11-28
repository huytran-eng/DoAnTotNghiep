package datn.codeexecutionapp.factory;

import datn.codeexecutionapp.exception.UnsupportedLanguageException;
import datn.codeexecutionapp.excutor.CodeExecutor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class CodeExecutorFactory {
    private final Map<String, CodeExecutor> executors;

    public CodeExecutorFactory(List<CodeExecutor> executorList) {
        this.executors = executorList.stream()
                .collect(Collectors.toMap(
                        CodeExecutor::getLanguage,
                        executor -> executor
                ));
    }

    public CodeExecutor getExecutor(String language) {
        CodeExecutor executor = executors.get(language.toLowerCase());
        if (executor == null) {
            throw new UnsupportedLanguageException("Language not supported: " + language);
        }
        return executor;
    }
}
