package datn.codeexecutionapp.excutor;

import datn.codeexecutionapp.domain.ExecutionResult;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
public class CppExecutor implements CodeExecutor {
    private static final int TIMEOUT_SECONDS = 5;

    @Override
    public String getLanguage() {
        return "cpp";
    }

    @Override
    public ExecutionResult execute(String code, String input) {
        try {
            // Tạo temporary directory cho compilation
            Path tempDir = Files.createTempDirectory("cpp_exec");
            String fileName = UUID.randomUUID().toString();
            Path sourcePath = tempDir.resolve(fileName + ".cpp");
            Path execPath = tempDir.resolve(fileName + ".exe");

            // Ghi source code vào file
            Files.writeString(sourcePath, code);

            // Biên dịch
            ExecutionResult compilationResult = compile(sourcePath, execPath);
            if (!compilationResult.success()) {
                return compilationResult;
            }

            // Chạy
            return runExecutable(execPath, input);

        } catch (Exception e) {
            return new ExecutionResult(null, e.getMessage(), 0, 0, false);
        }
    }

    private ExecutionResult compile(Path sourcePath, Path execPath) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("g++", sourcePath.toString(), "-o", execPath.toString());
        pb.redirectErrorStream(true);

        long startTime = System.currentTimeMillis();
        Process process = pb.start();

        boolean completed = process.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
        if (!completed) {
            process.destroy();
            return new ExecutionResult(null, "Compilation timed out", 0, 0, false);
        }

        String output = new String(process.getInputStream().readAllBytes());
        long compilationTime = System.currentTimeMillis() - startTime;

        if (process.exitValue() != 0) {
            return new ExecutionResult(null, "Compilation error: " + output, compilationTime, 0, false);
        }

        return new ExecutionResult(null, null, compilationTime, 0, true);
    }

    private ExecutionResult runExecutable(Path execPath, String input) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(execPath.toString());
        pb.directory(execPath.getParent().toFile());

        long startTime = System.currentTimeMillis();
        Process process = pb.start();

        // Cung cấp input nếu có
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

        // Ước tính memory usage
        long memoryUsed = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();

        return new ExecutionResult(
                output,
                error.isEmpty() ? null : error,
                executionTime,
                memoryUsed,
                error.isEmpty() && process.exitValue() == 0
        );
    }
}