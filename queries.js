const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://aurianemarcelino:MONGO28am@cluster0.kioho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


const client = new MongoClient(MONGODB_URI);

async function main() {
    try {
        await client.connect();
        const db = client.db('Lego');
        const deals = db.collection('deals');
        const sales = db.collection('sales');

        /* sales.find().forEach(doc => {
            sales.updateOne(
                { _id: doc._id },
                { $set: { published: new Date(doc.published) } }
            );
        });*/

        // 1. 5 best discount deals
        async function findBestDiscountDeals() {
            return await deals.find().sort({ discount: -1 }).project({_id:0, id:1, title:1, price:1, discount:1, comments:1}).limit(5).toArray();
        }

        // 2. 5 most commented deals
        async function findMostCommentedDeals() {
            return await deals.find().sort({ comments: -1 }).project({_id:0, id:1, title:1, price:1, discount:1, comments:1}).limit(5).toArray();
        }

        // 3. All deals sorted by price
        async function findDealsSortedByPrice(order = 'asc') {
            return await deals.find().sort({ price: order === 'asc' ? 1 : -1 }).project({_id:0, id:1, title:1, price:1, discount:1, comments:1}).toArray();
        }

        // 4. All deals sorted by date
        async function findDealsSortedByDate(order = 'desc') {
            return await deals.find().sort({ published: order === 'asc' ? 1 : -1 }).project({_id:0, id:1, title:1, price:1, discount:1, comments:1, published:1}).toArray();
        }

        // 5. All sales for a given LEGO set id
        async function findSalesByLegoSetId(legoSetId) {
            return await sales.find({ legoSetId }).project({_id:0, legoSetId:1, title:1, price:1, published:1}).toArray();
        }

        // 6. All sales scraped less than 3 weeks
        async function findRecentSales() {
            const threeWeeksAgo = new Date();
            threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
            console.log(threeWeeksAgo);
            return await sales.find({ published: { $gte: threeWeeksAgo } }).project({_id:0, legoSetId:1, title:1, price:1, published:1}).toArray();
        }

        console.log("📜 5 best discount :\n", await findBestDiscountDeals());
        console.log("📜 5 most commented deals :\n", await findMostCommentedDeals());
        console.log("📜 all deals sorted by price :\n", await findDealsSortedByPrice('desc'));
        console.log("📜 all deals sorted by date :\n", await findDealsSortedByDate());
        console.log("📜 all sales for a given lego set id :\n", await findSalesByLegoSetId('10363'));
        console.log("📜 all sales scraped less than 3 weeks :\n", await findRecentSales());

    } finally {
        await client.close();
    }
}

main().catch(console.error);