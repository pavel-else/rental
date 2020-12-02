import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_API_URL,
  // axios.defaults.headers.common['Authorization'] = process.env.VUE_APP_TOKEN,
});

export default class {
  baseUrl = '';
  httpClient = null;

  constructor(url = process.env.VUE_APP_BACKEND_API_URL) {
    this.baseUrl = url;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
  }


  async getProducts() {
    return await httpClient.get('/api/products');
  }
}
