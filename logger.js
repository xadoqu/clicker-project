const LogLevel = { INFO: 'INFO', DEBUG: 'DEBUG', ERROR: 'ERROR' };

function withLogging(level, fn) {
    return async function(...args) {
        const timestamp = new Date().toISOString();
        const start = performance.now();
        const result = await fn.apply(this, args);
        const duration = (performance.now() - start).toFixed(2);
        console.log(`[${timestamp}] [${level}] Initializing call... Duration: ${duration}ms`);
        return result;
    };
}