const { connectDB } = require('./database');
const fs = require('fs');

async function insertDeals() {
    const db = await connectDB();
    const deals = JSON.parse(fs.readFileSync('./server/dealabsDeals_updated.json', 'utf8'));

    const collection = db.collection('deals');
    let insertedCount = 0;

    for (const deal of deals) {
        const existingDeal = await collection.findOne({ _id: deal._id });

        if (!existingDeal) {
            await collection.insertOne(deal);
            insertedCount++;
        }
    }

    console.log(`Inserted ${insertedCount} deals`);
}

insertDeals().catch(console.error);