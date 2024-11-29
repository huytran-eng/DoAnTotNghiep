package datn.codeexecutionapp.excutor;

import datn.codeexecutionapp.domain.ExecutionResult;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@Component
public class PythonExecutor implements CodeExecutor {
    private static final int TIMEOUT_SECONDS = 5;

    @Override
    public String getLanguage() {
        return "python";
    }

    @Override
    public ExecutionResult execute(String code, String input) {
        try {
            Path codeFile = Files.createTempFile("code", ".py");
            Files.writeString(codeFile, code);

            ProcessBuilder pb = new ProcessBuilder("python3", codeFile.toString());
            return executeProcess(pb, input);
        } catch (Exception e) {
            return new ExecutionResult(null, e.getMessage(), 0, 0, false);
        }
    }

    private ExecutionResult executeProcess(ProcessBuilder pb, String input) throws IOException, InterruptedException {
        long startTime = System.currentTimeMillis();
        Process process = pb.start();

        if (input != null && !input.isEmpty()) {
            try (var writer = new OutputStreamWriter(process.getOutputStream())) {
                writer.write(input);
                writer.write("\n");
                writer.flush();
            }
        }

        boolean completed = process.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
        if (!completed) {
            process.destroy();
            return new ExecutionResult(null, "Execution timed out", 0, 0, false);
        }

        String output = new String(process.getInputStream().readAllBytes()).trim();
        String error = new String(process.getErrorStream().readAllBytes()).trim();
        long executionTime = System.currentTimeMillis() - startTime;

        return new ExecutionResult(
                output,
                error.isEmpty() ? null : error,
                executionTime,
                0, // Memory tracking would require additional implementation
                error.isEmpty() && process.exitValue() == 0
        );
    }
}
