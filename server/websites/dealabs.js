const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */


function formatImage(imageUrl) {
    // Exemple : Ajouter un prefixe ou transformer l'URL
    return imageUrl ? `https://cdn.example.com/${imageUrl}` : null;
}

const parse = data => {
    const $ = cheerio.load(data, { 'xmlMode': true });

    return $('div.js-threadList article')
        .map((i, element) => {
            const link = $(element)
                .find('a[data-t="threadLink"]')
                .attr('href');

            const data = JSON.parse($(element)
                    .find('div.js-vue2')
                    .attr('data-vue2'));

            const thread = data.props.thread;
            const retail = thread.nextBestPrice;
            const price = thread.price;
            const discount = parseInt((retail - price) / retail * 100)
            const temperature = + thread.temperature;
            const photo = thread.mainImage || null; //formatImage(thread.mainImage);
            const comments = +thread.commentCount;
            const published = thread.publishedAt;
            const title = thread.title;
            const id = thread.threadId;


            return {
                link,
                retail,
                price,
                discount,
                temperature,
                photo,
                comments,
                published,
                title,
                id
            };
        })
        .get();
};

/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */
module.exports.scrape = async url => {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    if (response.ok) {
        const body = await response.text();

        return parse(body);
    }

    console.error(response);

    return null;
};