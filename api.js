class ApiProxy {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.apiKey = "PLANET-CLICKER_KEY";
    this.strategy = "API_KEY";
    this.token = "SECRET_123";
  }

  setAuthenticationStrategy(newStrategy, newToken) {
    this.strategy = newStrategy;
    this.token = newToken;
    console.log(`[Proxy] Authentication strategy updated: ${newStrategy}`);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const startTime = Date.now();
    const headers = { 'Content-Type': 'application/json' , ...options.headers};

    if (this.strategy === "JWT") {
      headers['Authorization'] = `JWT ${this.token}`;
    } else {
      headers['X-API-Key'] = this.apiKey;
    }

    console.log(`[Proxy] Intercepting ${options.method || 'GET'} request to ${endpoint} with strategy ${this.strategy}`);
    try {
      const response = await fetch(url, finalOptions);
      const duration = Date.now() - startTime;
      console.log(`[Proxy] Request to ${endpoint} completed in ${duration}ms with status ${response.status}`);
      return response;
    } catch (error) {
      console.error(`[Proxy Critical Error] ${endpoint} ${error.message}`);
      return { ok: false, status: 'error', message: "API Server not found" };
    }
  }
}
const apiService = new ApiProxy("https://api.planet-clicker.com/v1");
