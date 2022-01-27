const Db = require('./db');
const telegramBootstrap = require('./telegram');

async function main() {
  const db = new Db();

  await telegramBootstrap();
}

main();
