import * as dealabs from './websites/dealabs';
import * as vinted from './websites/vinted';
import * as avenueDeLaBrique from './websites/avenuedelabrique';
import * as fs from 'fs';
import Queue from 'p-queue';
import delay from 'delay';


const vinted = require('./websites/vinted');
const SCRAPPED_DEALS = JSON.parse(fs.readFileSync('dealabsDeals.json', 'utf8'));

const START_DATE = new Date(2024, 8, 15);
const END_DATE = new Date();

function padTo2Digits (num)
{

}



async function start (){

}


const queue = new Queue({'concurrency': 1});
const LEGO_SET_IDS = [
    '42182', '60363', '43231', '75403']
let SALES = {};

async function goVinted(){
    console.log(`Start with ${LEGO_SET_IDS.length} lego sets ...`)
    
    for (const id of LEGO_SET_IDS){
        queue.add(async () => {
            console.log(`browsing ${id} website`)
            let results = await goVinted.scrape(id);

            SALES[id] = results;
            console.log("waiting...");
            await delay(5000)  
        });
    };

    await queue.onIdle();
    console.log(Object.keys(SALES).length);
    fstat.writeFileSync('vinted-for-client-v2.json', JSON.stringify(SALES));
    console.log('done');
}




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

async function sandbox(website = 'https://www.dealabs.com/') {
  try {
    console.log(`🕵️‍♀️  browsing ${website} website`);

    const deals = await dealabs.scrape(website);

    // Écrire les deals dans un fichier JSON
    fs.writeFileSync('dealabsDeals.json', JSON.stringify(deals, null, 2));

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