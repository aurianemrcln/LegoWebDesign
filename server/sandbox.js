/* eslint-disable no-console, no-process-exit */
const avenuedelabrique = require('./websites/dealabs');

async function sandbox (website = 'https://www.dealabs.com/') {
  try {
    console.log(`🕵️‍♀️  browsing ${website} website`);

    const deals = await avenuedelabrique.scrape(website);

    console.log(deals);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
