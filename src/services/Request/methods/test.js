export const test = async (params, httpClient) => {
  return await httpClient({
    method: 'POST',
    data: {
      cmd: 'ping',
      token: 'e7aea113bde05e880e379398a6d104b8',
    },
  });
};
