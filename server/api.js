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

/*
// Route pour récupérer un deal par son _id
app.get('/deals/:_id', async (request, response) => {
  try {
    await client.connect();
    const db = client.db('Lego');
    const dealsCollection = db.collection('deals');
    const dealId = request.params._id;

    // Utilisez find pour obtenir tous les deals correspondant à l'ID
    const deals = await dealsCollection.find({ _id: new ObjectId(dealId) }).toArray();

    if (deals.length > 0) {
      response.json(deals);
    } else {
      response.status(404).send('No deals found1');
    }
  } catch (error) {
    console.error('Error fetching deals:', error);
    response.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});*/

// Route pour rechercher des deals avec des paramètres de requête
app.get('/deals/search', async (request, response) => {
  const {
    limit = 10,
    _id,
    legoSetId,
    pricemin,
    pricemax,
    commentsmin,
    commentsmax,
    tempmin,
    tempmax,
    discountmin,
    discountmax,
    retailmin,
    retailmax,
    datemin
  } = request.query;
  const query = {};

  if (_id) { query._id = _id; }
  if (legoSetId) { query.legoSetId = legoSetId; }
  if (pricemax) query.price = { $lte: parseFloat(pricemax) };
  if (pricemin) query.price = { $gte: parseFloat(pricemin) };
  if (commentsmax) query.comments = { $lte: parseFloat(commentsmax) };
  if (commentsmin) query.comments = { $gte: parseFloat(commentsmin) };
  if (tempmax) query.temperature = { $lte: parseFloat(tempmax) };
  if (tempmin) query.temperature = { $gte: parseFloat(tempmin) };
  if (discountmin) query.discount = { $gte: parseFloat(discountmin) };
  if (discountmax) query.discount = { $lte: parseFloat(discountmax) };
  if (retailmin) query.retail = { $gte: parseFloat(retailmin) };
  if (retailmax) query.retail = { $lte: parseFloat(retailmax) };
  if (datemin) query.published = { $gte: new Date(datemin).getTime() / 1000 };

  try {
    await client.connect();
    const db = client.db('Lego');
    const dealsCollection = db.collection('deals');

    const deals = await dealsCollection.find(query)
      .sort({ price: 1 })
      .limit(parseInt(limit))
      .toArray();

    response.json({ limit: parseInt(limit), total: deals.length, results: deals });
  } catch (error) {
    console.error('Error searching deals:', error);
    response.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

// Route pour rechercher des ventes Vinted
app.get('/sales/search', async (request, response) => {
  const { limit = 10, legoSetId } = request.query;
  const query = {};

  // Filtrer par legoSetId si fourni
  if (legoSetId) {
    query.legoSetId = legoSetId;
  }

  try {
    await client.connect();
    const db = client.db('Lego');
    const salesCollection = db.collection('sales');

    // Récupérer les ventes correspondant au legoSetId
    const sales = await salesCollection.find(query)
      .sort({ price: 1 })
      .limit(parseInt(limit))
      .toArray();

    response.json({ limit: parseInt(limit), total: sales.length, results: sales });
  } catch (error) {
    console.error('Error searching sales:', error);
    response.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`📡 Running on port ${PORT}`);
});
