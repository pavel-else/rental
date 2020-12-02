import axios from 'axios';
import * as Test from './methods/test';

export default class {
  baseUrl = '';
  httpClient = null;

  constructor(url = process.env.VUE_APP_BACKEND_API_URL) {
    this.baseUrl = url;
    this.httpClient = axios.create({
      baseURL: url,
    });
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
  }

  test = Test.test(this.httpClient);
}
