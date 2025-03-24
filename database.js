const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://aurianemarcelino:MONGO28am@cluster0.kioho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB_NAME = 'Lego';

let client;
let db;

async function connectDB() {
    try {
        if (!client) {
            client = new MongoClient(MONGODB_URI);
            await client.connect(); // Connexion explicite
            db = client.db(MONGODB_DB_NAME);
            console.log('✅ Connected to MongoDB');
        }
        return db;
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

module.exports = { connectDB };