import RequestManager from '@/services/Request/RequestManager';

describe('RequestManager', () => {
  it('main flow', () => {
    const Request = new RequestManager();
    expect(Request).toBeTruthy();

    expect(Request.getBaseUrl()).toBe(process.env.VUE_APP_BACKEND_API_URL);

    const url1 = 'https://url1.com';
    Request.setBaseUrl(url1);
    expect(Request.getBaseUrl()).toBe(url1);
  });

  it('test method', async () => {
    const Request = new RequestManager();

    const text = 'abcd';
    const result = await Request.test(text);
    const url = process.env.VUE_APP_BACKEND_API_URL;

    expect(result).toEqual({ text, url });
  });
});
