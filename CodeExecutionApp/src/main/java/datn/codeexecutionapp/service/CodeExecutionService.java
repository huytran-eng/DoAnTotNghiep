package datn.codeexecutionapp.service;

import datn.codeexecutionapp.domain.ExecutionRequest;
import datn.codeexecutionapp.domain.ExecutionResult;
import datn.codeexecutionapp.excutor.CodeExecutor;
import datn.codeexecutionapp.factory.CodeExecutorFactory;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
public class CodeExecutionService {
    private final CodeExecutorFactory executorFactory;
    private final ExecutorService executorService;

    public CodeExecutionService(CodeExecutorFactory executorFactory) {
        this.executorFactory = executorFactory;
        // Tạo thread pool với số lượng thread bằng số core của CPU
        this.executorService = Executors.newFixedThreadPool(
                Runtime.getRuntime().availableProcessors()
        );
    }

    public List<ExecutionResult> execute(ExecutionRequest request) {
        CodeExecutor executor = executorFactory.getExecutor(request.language());

        List<CompletableFuture<ExecutionResult>> futures = request.testCases().stream()
                .map(testCase -> CompletableFuture.supplyAsync(() -> {
                    try {
                        ExecutionResult result = executor.execute(request.code(), testCase.input());
                        return new ExecutionResult(
                                result.output(),
                                result.error(),
                                result.executionTime(),
                                result.memoryUsed(),
                                result.success() && result.output().equals(testCase.expectedOutput())
                        );
                    } catch (Exception e) {
                        // Xử lý lỗi khi thực thi test case
                        return new ExecutionResult(
                                "",
                                e.getMessage(),
                                0L,
                                0L,
                                false
                        );
                    }
                }, executorService))
                .collect(Collectors.toList());

        try {
            // Chờ tất cả các test case hoàn thành với timeout
            return futures.stream()
                    .map(future -> {
                        try {
                            return future.get(30, TimeUnit.SECONDS);
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            return createErrorResult("Execution was interrupted");
                        } catch (TimeoutException e) {
                            return createErrorResult("Execution timed out");
                        } catch (ExecutionException e) {
                            return createErrorResult("Execution failed: " + e.getCause().getMessage());
                        }
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to execute code: " + e.getMessage(), e);
        }
    }

    private ExecutionResult createErrorResult(String errorMessage) {
        return new ExecutionResult(
                "",
                errorMessage,
                0L,
                0L,
                false
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