const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.listLayout-main article')
    .map((i, element) => {
      const price = parseFloat(
        $(element)
          .find('span.vAlign--all-tt')
          .text()
      );

      const discount = Math.abs(parseInt(
        $(element)
          .find('span.textBadge--green')
          .text()
      ));

      const title = 
        $(element)
          .find('strong.thread-title')
          .text()
      ;

      return {
        discount,
        price,
        title
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
  const response = await fetch(url);

  if (response.ok) {
    const body = await response.text();

    return parse(body);
  }

  console.error(response);

  return null;
};