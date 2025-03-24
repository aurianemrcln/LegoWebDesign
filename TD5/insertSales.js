const fs = require('fs');
const path = require('path');
const { connectDB } = require('./database');

async function insertSales() {
    const db = await connectDB();
    const collection = db.collection('sales');

    // Charger le fichier JSON
    const filePath = path.join(__dirname, './server/vintedSales.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const salesData = JSON.parse(rawData);

    // Transformer l'objet en un tableau plat
    const sales = [];
    for (const legoSetId in salesData) {
        const salesList = salesData[legoSetId].map(sale => ({
            ...sale,
            legoSetId // Ajout de l'ID du set LEGO à chaque vente
        }));
        sales.push(...salesList);
    }

    // Vérifier si les données sont bien un tableau
    console.log('📜 Données transformées pour MongoDB:', sales);

    if (!Array.isArray(sales)) {
        console.error('❌ Erreur : sales n\'est pas un tableau');
        return;
    }

    // Insérer dans MongoDB
    const result = await collection.insertMany(sales);
    console.log(`✅ ${result.insertedCount} ventes insérées !`);
}

insertSales().catch(console.error);