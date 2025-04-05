const { connectDB } = require('./database');
const fs = require('fs');

async function insertDeals() {
    const db = await connectDB();
    const deals = JSON.parse(fs.readFileSync('./server/dealabsDeals_updated.json', 'utf8'));

    const collection = db.collection('deals');
    const result = await collection.insertMany(deals);
    
    console.log(`Inserted ${result.insertedCount} deals`);
}

insertDeals().catch(console.error);