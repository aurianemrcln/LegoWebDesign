// Connexion à MongoDB
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://aurianemarcelino:MONGO28am@cluster0.kioho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB_NAME = 'Lego';

let client;
let db;

async function connectDB() {
    if (!client) {
        client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db(MONGODB_DB_NAME);
        console.log('Connected to MongoDB');
    }
    return db;
}

module.exports = { connectDB };