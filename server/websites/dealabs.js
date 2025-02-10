const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.listLayout-main js-threadList cept-personalization-recombee_fallback_recommendations cept-picking-method-automated_picks article')
    .map((i, element) => {
      const price = parseFloat(
        $(element)
          .find('div.threadListCard thread-clickRoot div.threadListCard-body div.flex boxAlign-ai--fromW3-c flex--dir-col flex--fromW3-dir-row gap--h-12p flex--wrap width--all-12 div.flex--inline boxAlign-ai--all-c flex--wrap gap--all-1 space--toW3-mb-2 gap--h-12p span.overflow--wrap-off flex flex flex--wrap boxAlign-ai--all-c span.vAlign--all-tt span')
          .text()
      );

      const discount = Math.abs(parseInt(
        $(element)
          .find('div.threadListCard thread-clickRoot div.threadListCard-body div.flex boxAlign-ai--fromW3-c flex--dir-col flex--fromW3-dir-row gap--h-12p flex--wrap width--all-12 div.flex--inline boxAlign-ai--all-c flex--wrap gap--all-1 space--toW3-mb-2 gap--h-12p span.overflow--wrap-off flex flex flex--wrap boxAlign-ai--all-c span.textBadge bRad--a-m flex--inline text--b boxAlign-ai--all-c size--all-s size--fromW3-m space--h-1 space--ml-1 space--mr-0 textBadge--green span')
          .text()
      ));

      const title = 
        $(element)
          .find('div.threadListCard thread-clickRoot div.threadListCard-body strong.thread-title title')
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