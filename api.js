class ApiProxy {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "X-Game-Version": "1.0.0",
      },
    };
    console.log(`[Proxy] Intercepting request to: ${endpoint}`);
    return fetch(url, authOptions);
  }
}
const apiService = new ApiProxy("https://api.yourgame.com/v1");
