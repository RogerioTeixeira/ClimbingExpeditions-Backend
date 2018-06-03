import App from './app';
import Logger from './helpers/logger';

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

export default App;
