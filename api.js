class ApiProxy {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.strategy = "API_KEY";
    this.token = "SECRET_123";
  }

  setStrategy(newStrategy, newToken) {
    this.strategy = newStrategy;
    this.token = newToken;
    console.log(`[Proxy] Authentication strategy updated: ${newStrategy}`);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = { ...options.headers };

    if (this.strategy === "JWT") {
      headers['Authorization'] = `JWT ${this.token}`;
    } else {
      headers['X-API-Key'] = this.token;
    }
    return fetch(url, { ...options, headers })
  }
}
const apiService = new ApiProxy("https://api.planet-clicker.com/v1");
