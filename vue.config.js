const testDomainName = 'app.rentix.t.biz';
const testDomainPort = '9090';
const testDomainFull = 'http://' + testDomainName + ':' + testDomainPort;

module.exports = {
  css: {
    modules: true
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: 'assets',
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,

  devServer: {
    // port: 8080,
    // open: false,
    // https: true,
    public : testDomainName + ':' + testDomainPort,
    proxy: {
      [testDomainName + ':' + testDomainPort]: {
        target: testDomainFull,
        secure: false,
        changeOrigin: true,
        bypass() {},
        onProxyReq() {},
        onProxyRes() {},
      },
    },
    // headers: { "Access-Control-Allow-Origin": "*" },
  },
}