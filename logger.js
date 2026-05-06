const LogLevel = { INFO: 'INFO', DEBUG: 'DEBUG', ERROR: 'ERROR' };

function withLogging(level, fn) {
    return function(...args) {
        console.log(`[${level}] Args:`, args);
        const result = fn.apply(this, args);
        console.log(`[${level}] Result:`, result);
        return result;
    };
}