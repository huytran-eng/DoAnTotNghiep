package datn.codeexecutionapp.excutor;

import datn.codeexecutionapp.domain.ExecutionResult;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class JavaExecutor implements CodeExecutor {
    private static final int TIMEOUT_SECONDS = 5;
    private static final String CLASS_NAME_PATTERN = "public\\s+class\\s+(\\w+)";

    @Override
    public String getLanguage() {
        return "java";
    }

    @Override
    public ExecutionResult execute(String code, String input) {
        try {
            // Extract class name from code
            String className = extractClassName(code);
            if (className == null) {
                return new ExecutionResult(null, "No public class found", 0, 0, false);
            }

            // Create temporary directory for compilation
            Path tempDir = Files.createTempDirectory("java_exec");
            Path sourcePath = tempDir.resolve(className + ".java");

            // Write source code to file
            Files.writeString(sourcePath, code);

            // Compile
            ExecutionResult compilationResult = compile(sourcePath);
            if (!compilationResult.success()) {
                return compilationResult;
            }

            // Run
            return runClass(tempDir, className, input);

        } catch (Exception e) {
            return new ExecutionResult(null, e.getMessage(), 0, 0, false);
        }
    }

    private String extractClassName(String code) {
        Pattern pattern = Pattern.compile(CLASS_NAME_PATTERN);
        Matcher matcher = pattern.matcher(code);
        return matcher.find() ? matcher.group(1) : null;
    }

    private ExecutionResult compile(Path sourcePath) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("javac", sourcePath.toString());
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

    private ExecutionResult runClass(Path directory, String className, String input) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("java", "-Xmx512m", "-cp", directory.toString(), className);
        pb.directory(directory.toFile());

        long startTime = System.currentTimeMillis();
        Process process = pb.start();

        // Provide input if any
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

        // Get memory usage (rough estimate)
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
