package datn.codeexecutionapp.service;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import datn.codeexecutionapp.domain.ExecutionRequest;
import datn.codeexecutionapp.domain.ExecutionResult;
import datn.codeexecutionapp.excutor.CodeExecutor;
import datn.codeexecutionapp.factory.CodeExecutorFactory;
import datn.codeexecutionapp.utils.TimeoutExecutor;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
public class CodeExecutionService {
    private final CodeExecutorFactory executorFactory;
    private final ExecutorService executorService;

    private final int executionTimeout = 30;
    private final int threadPoolSize = Math.max(2, Runtime.getRuntime().availableProcessors());

    public CodeExecutionService(CodeExecutorFactory executorFactory) {
        this.executorFactory = executorFactory;
        this.executorService = new ThreadPoolExecutor(
                threadPoolSize, // core pool size
                threadPoolSize, // max pool size
                60L, TimeUnit.SECONDS, // keep alive time
                new LinkedBlockingQueue<>(100), // work queue
                new ThreadFactoryBuilder()
                        .setNameFormat("code-executor-%d")
                        .setDaemon(true)
                        .build(),
                new ThreadPoolExecutor.CallerRunsPolicy() // rejection policy
        );
    }

    public List<ExecutionResult> execute(ExecutionRequest request) {
        CodeExecutor executor = executorFactory.getExecutor(request.language());

        // Thêm giới hạn số lượng test cases để tránh quá tải
        int testCaseCount = request.testCases().size();
        if (testCaseCount > 100) { // có thể cấu hình giới hạn này
            throw new IllegalArgumentException("Too many test cases. Maximum allowed: 100");
        }

        List<CompletableFuture<ExecutionResult>> futures = request.testCases().stream()
                .map(testCase -> CompletableFuture.supplyAsync(() -> {
                    try {
                        // Thêm timeout cho từng lần thực thi
                        ExecutionResult result = TimeoutExecutor.withTimeout(
                                () -> executor.execute(request.code(), testCase.input()),
                                executionTimeout,
                                TimeUnit.SECONDS
                        );

                        return new ExecutionResult(
                                result.output().replace("\r\n", "\n"),
                                result.error(),
                                result.executionTime(),
                                result.memoryUsed(),
                                result.output().replace("\r\n", "\n").equals(testCase.expectedOutput())
                        );
                    } catch (TimeoutException e) {
                        return createErrorResult("Code execution timed out after " + executionTimeout + " seconds");
                    } catch (Exception e) {
                        return createErrorResult("Execution error: " + e.getMessage());
                    }
                }, executorService))
                .collect(Collectors.toList());

        try {
            // Thêm timeout tổng thể cho toàn bộ quá trình
            return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                    .thenApply(v -> futures.stream()
                            .map(CompletableFuture::join)
                            .collect(Collectors.toList()))
                    .get(executionTimeout * 2, TimeUnit.SECONDS);
        } catch (Exception e) {
            throw new RuntimeException("Failed to execute code: " + e.getMessage(), e);
        }
    }
    private ExecutionResult createErrorResult(String errorMessage) {
        return new ExecutionResult(
                "",             // output
                errorMessage,   // error
                0L,            // executionTime
                0L,            // memoryUsed
                false          // success
        );
    }
    @PreDestroy
    public void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}