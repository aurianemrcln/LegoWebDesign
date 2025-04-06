import * as dealabs from './websites/dealabs.js';
import * as vinted from './websites/vinted.js';
import * as avenueDeLaBrique from './websites/avenuedelabrique.js';

import * as fs from 'fs';
import Queue from 'p-queue';
import delay from 'delay';


const queue = new Queue({ concurrency: 1 });
const LEGO_SET_IDS = [
  '42182', '60363', '43231', '75403',
  '75404', '21034', '42635',
  '75405', '76266', '42176', '42635',
  '71460', '42202', '40524',
  '75402', '76262', '77051', '71387',
  '76303', '21333', '43224', '10363',
  '60373', '72032', '75332', '76959',
  '76969', '40460'
];
let SALES = {};

async function goVinted() {
  console.log(`Start with ${LEGO_SET_IDS.length} lego sets ...`);

  for (const id of LEGO_SET_IDS) {
    queue.add(async () => {
      console.log(`browsing ${id} website`);
      let results = await vinted.scrape(id);

      if (results) {
        SALES[id] = results;
        console.log(`Results for ${id}:`, results);
      } else {
        console.error(`No results for ${id}`);
      }

      console.log("waiting...");
      await delay(5000);
    });
  }

  await queue.onIdle();
  console.log(`Total sales found: ${Object.keys(SALES).length}`);
  fs.writeFileSync('vintedSales.json', JSON.stringify(SALES, null, 2));
  console.log('done');
  console.log(SALES); // Affiche les résultats
}

goVinted();




/*const avenueDeLaBrique = require('./websites/avenuedelabrique');

async function sandbox (website = 'https://www.avenuedelabrique.com/promotions-et-bons-plans-lego') {
  try {
    console.log(`🕵️‍♀️  browsing ${website} website`);

    const deals = await avenueDeLaBrique.scrape(website);

    console.log(deals);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
const [,, eshop] = process.argv;
sandbox(eshop); */



/*
const fs = require('fs');
const dealabs = require('./websites/dealabs');

async function sandbox(baseUrl = 'https://www.dealabs.com/search?q=lego') {
  try {
    console.log(`🕵️‍♀️  browsing ${baseUrl} website`);

    const allDeals = [];
    const pagesToScrape = 100;

    for (let page = 1; page <= pagesToScrape; page++) {
      const url = `${baseUrl}&page=${page}`;
      // console.log(`Scraping page ${page}: ${url}`);

      const deals = await dealabs.scrape(url);
      allDeals.push(...deals);
    }

    // Écrire les deals dans un fichier JSON
    fs.writeFileSync('dealabsDeals.json', JSON.stringify(allDeals, null, 2));

    console.log('Deals have been saved to dealabsDeals.json');
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;
sandbox(eshop);
*/
