export default class HttpClient {
  baseUrl = 'http://localhost:3000';

  constructor(resource) {
    this.baseUrl = `${this.baseUrl}/${resource}`;
  }

  async listAll() {
    return await this.getData(this.baseUrl);
  }

  async find(id) {
    return await this.getData(`${this.baseUrl}/${id}`);
  }

  async create(data) {
    return await this.sendData(this.baseUrl, 'POST', data);
  }

  async getData(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
  }

  async sendData(url, method, data) {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}