const LogLevel = { DEBUG: "DEBUG", INFO: "INFO", ERROR: "ERROR" };
const LogConfig = { currentLevel: LogLevel.DEBUG, useStructured: true };

function withLogging(level, fn) {
    return async function(...args) {
        const start = performance.now();
        const result = await fn.apply(this, args);
        const duration = (performance.now() - start).toFixed(2);
        const logEntry = {
            time: new Date().toISOString(),
            level: level,
            function: fn.name,
            args: args,
            duration: `${duration}ms`,
            output: result,
        }
        if(LogConfig.useStructured) {
            console.log("[Structured Log]", JSON.stringify(logEntry, null, 2));
        } else {
            console.log(`[${logEntry.time}] [${logEntry.level}] Initializing call... Duration: ${logEntry.duration}`);
        }
        return result;
    };
}