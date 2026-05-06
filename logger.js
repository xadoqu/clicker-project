const LogLevel = { INFO: 'INFO', DEBUG: 'DEBUG', ERROR: 'ERROR' };

function withLogging(level, fn) {
    return function(...args) {
        console.log(`[${level}] Calling function...`);
        return fn.apply(this, args);
    };
}