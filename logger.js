const LogConfig = { currentLevel: LogLevel.INFO };

function withLogging(level, fn) {
    return async function(...args) {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.ERROR];
        const timestamp = new Date().toISOString();
        const start = performance.now();
        const result = await fn.apply(this, args);
        const duration = (performance.now() - start).toFixed(2);
        if(levels.indexOf(level) >= levels.indexOf(LogConfig.currentLevel)) {
            return await fn.apply(this, args);
        }
        console.log(`[${timestamp}] [${level}] Initializing call... Duration: ${duration}ms`);
        const start = performance.now();
        return result;
    };
}