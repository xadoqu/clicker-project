const LogLevel = { INFO: 'INFO', DEBUG: 'DEBUG', ERROR: 'ERROR' };

function withLogging(level, fn) {
    return async function(...args) {
        console.log(`[${level}] Initializing call...`);
        try {
            const result = await fn.apply(this, args);
            console.log(`[${level}] Result:`, result);
            return result;
        } catch (error) {
            console.error(`[${level} Critical Error] ${error.message}`);
            throw error;
        }
    };
}