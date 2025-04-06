const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { MongoClient } = require('mongodb');

const PORT = 8092;
const MONGODB_URI = 'mongodb+srv://aurianemarcelino:MONGO28am@cluster0.kioho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
const client = new MongoClient(MONGODB_URI);

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

// Route pour récupérer un deal spécifique
app.get('/deals/:id', async (request, response) => {
  try {
    await client.connect();
    const db = client.db('Lego');
    const dealsCollection = db.collection('deals');
    const dealId = request.params.id;

    // Utilisez find pour obtenir tous les deals correspondant à l'ID
    const deals = await dealsCollection.find({ id: dealId }, { projection: { _id: 0 } }).toArray();

    if (deals.length > 0) {
      response.json(deals);
    } else {
      response.status(404).send('No deals found');
    }
  } catch (error) {
    console.error('Error fetching deals:', error);
    response.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

// Route pour récupérer les ventes pour un set LEGO donné
app.get('/sales/:legoSetId', async (request, response) => {
  try {
    await client.connect();
    const db = client.db('Lego');
    const sales = db.collection('sales');
    const legoSetId = request.params.legoSetId;
    const salesList = await sales.find({ legoSetId })
      .project({ _id: 0 })
      .toArray();
    response.json(salesList);
  } catch (error) {
    response.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

// Route pour rechercher des deals
app.get('/deals/search', async (request, response) => {
  try {
    await client.connect();
    const db = client.db('Lego');
    const deals = db.collection('deals');
    const { limit, price, date, filterBy } = request.query;

    let query = {};
    if (price) query.price = { $lte: parseFloat(price) };
    if (date) query.published = { $gte: new Date(date) };

    const dealsList = await deals.find(query)
      .sort(filterBy || { published: -1 })
      .limit(limit ? parseInt(limit) : 10)
      .project({ _id: 0 })
      .toArray();

    response.json(dealsList);
  } catch (error) {
    response.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});


app.listen(PORT, () => {
  console.log(`📡 Running on port ${PORT}`);
});
