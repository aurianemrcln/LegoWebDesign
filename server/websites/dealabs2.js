const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// URL de la recherche Lego sur Dealabs
const url = 'https://www.dealabs.com/search?q=lego';

async function scrapeLegoDeals() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let deals = [];

    // Sélectionner chaque offre Lego
    $('strong.thread-title a.cept-tt').each((index, element) => {
      const title = $(element).text().trim(); // Récupère le titre
      const link = $(element).attr('href');  // Récupère le lien

      if (title && link) {
        deals.push({
          title,
          link: `https://www.dealabs.com${link}` // Ajoute le domaine
        });
      }
    });

    // Sauvegarder les données dans un fichier JSON
    fs.writeFileSync('lego_deals.json', JSON.stringify(deals, null, 2));

    console.log('Offres Lego enregistrées dans lego_deals.json');
  } catch (error) {
    console.error(' Erreur de scraping:', error);
  }
}

// Lancer le scraping
scrapeLegoDeals();