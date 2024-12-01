package datn.codeexecutionapp.utils;
import java.util.concurrent.*;

public class TimeoutExecutor {
    public static <T> T withTimeout(Callable<T> task, long timeout, TimeUnit unit)
            throws TimeoutException, ExecutionException, InterruptedException {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        try {
            Future<T> future = executor.submit(task);
            return future.get(timeout, unit);
        } finally {
            executor.shutdownNow();
        }
    }
}