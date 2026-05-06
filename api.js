class ApiProxy {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`[Proxy] Intercepting request to: ${url}`);
    return fetch(url, options);
  }
}
const apiService = new ApiProxy("https://api.yourgame.com/v1");
