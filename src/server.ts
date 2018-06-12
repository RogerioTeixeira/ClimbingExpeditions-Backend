import App from './app';
import Logger from './helpers/logger';

var proxy = require('httpx-proxy-agent-config');




console.log(process.env.https_proxy)
process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

process.on('exit', () => {
  Logger.info(`[Server] Stopped!`);
});

(async () => {
  await App.start();
})();

if (process.env.http_proxy) {
  proxy.install({
    http_proxy: process.env.http_proxy,
    https_proxy: process.env.https_proxy
  });
}


export default App;
