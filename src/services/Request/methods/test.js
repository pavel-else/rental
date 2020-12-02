export const test = (httpClient) => (params) => {
  console.log('A', httpClient);
  return httpClient;
};
