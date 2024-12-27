package datn.codeexecutionapp.controller;

import datn.codeexecutionapp.domain.ExecutionRequest;
import datn.codeexecutionapp.domain.ExecutionResponse;
import datn.codeexecutionapp.domain.ExecutionResult;
import datn.codeexecutionapp.exception.UnsupportedLanguageException;
import datn.codeexecutionapp.service.CodeExecutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/execute")
public class CodeExecutionController {
    private final CodeExecutionService executionService;

    public CodeExecutionController(CodeExecutionService executionService) {
        this.executionService = executionService;
    }

    @PostMapping
    public ResponseEntity<ExecutionResponse> executeCode(@RequestBody ExecutionRequest request) {
        try {
            List<ExecutionResult> results = executionService.execute(request);
            String message = results.stream().anyMatch(result -> result.error()!=null) ? results.get(0).error() : null;
            boolean isSuccess = message == null;
            return ResponseEntity.ok( ExecutionResponse.builder()
                    .message(message)
                    .isSuccess(isSuccess)
                    .testCases(results)
                    .build());
        } catch (UnsupportedLanguageException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
