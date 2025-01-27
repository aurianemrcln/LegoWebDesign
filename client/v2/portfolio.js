// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page
let currentDeals = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const filterDiscount = document.querySelector('#discount-filter');

/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @param  {Number}  [discount=0] - minimum discount percentage to filter deals
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

/**
 * Render list of deals
 * @param {Array} deals
 */
const renderDeals = deals => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = deals
    .map(deal => {
      return `
      <div class="deal" id=${deal.uuid}>
        <span>${deal.id}</span>
        <a href="${deal.link}">${deal.title}</a>
        <span>${deal.price}</span>
        <span>${deal.discount}% off</span>
        <span>${deal.comments} comments</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = deals => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');

  selectLegoSetIds.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbDeals.innerHTML = count;
};

const render = (deals, pagination) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals)
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */
selectShow.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Select the number of the page to display
 */
selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals(parseInt(event.target.value), selectShow.value);

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Initialize application on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

// Feature 2 - Filter by best discount
const filterDiscountButton = document.querySelector('#filters button:first-of-type');
filterDiscountButton.addEventListener('click', async () => {
  const deals = await fetchDeals(currentPagination.currentPage, selectShow.value);

  // Filtrer les deals avec un discount supérieur à 50%
  const filteredDeals = deals.result.filter(deal => deal.discount > 50);

  // Mettre à jour la pagination locale pour refléter les résultats filtrés
  const filteredPagination = {
    ...currentPagination,
    count: filteredDeals.length,
    pageCount: Math.ceil(filteredDeals.length / selectShow.value),
  };

  setCurrentDeals({ result: filteredDeals, meta: filteredPagination });
  render(currentDeals, filteredPagination);
});

const sortSelect = document.querySelector('#sort-select');

sortSelect.addEventListener('change', async (event) => {
  const sortOption = event.target.value;

  // Vérifie si l'utilisateur veut trier par meilleur discount
  if (sortOption === 'price-asc') {
    const sortedDeals = sortDealsByDiscount([...currentDeals], 'desc'); // Tri par meilleur discount
    render(sortedDeals, currentPagination);
  }
});

/**
 * Sort deals by discount
 * @param {Array} deals - List of deals
 * @param {String} order - Order of sorting ('desc' for best discount first)
 * @return {Array}
 */
const sortDealsByDiscount = (deals, order = 'desc') => {
  return deals.sort((a, b) => {
    if (order === 'desc') {
      return b.discount - a.discount; // Tri décroissant
    }
    return a.discount - b.discount; // Tri croissant (si nécessaire dans le futur)
  });
};


// Feature 3 - Filter by most commented
// Filtrer les offres avec plus de 15 commentaires
const filterCommentsButton = document.querySelector('#filters button:nth-of-type(2)');
filterCommentsButton.addEventListener('click', async () => {
  const deals = await fetchDeals(currentPagination.currentPage, selectShow.value);

  // Filtrer les deals avec plus de 15 commentaires
  const filteredDeals = deals.result.filter(deal => deal.comments > 15);

  // Mettre à jour la pagination locale pour refléter les résultats filtrés
  const filteredPagination = {
    ...currentPagination,
    count: filteredDeals.length,
    pageCount: Math.ceil(filteredDeals.length / selectShow.value),
  };

  setCurrentDeals({ result: filteredDeals, meta: filteredPagination });
  render(currentDeals, filteredPagination);
});

// Trier les offres par nombre de commentaires
const sortDealsByComments = (deals, order = 'desc') => {
  return deals.sort((a, b) => {
    if (order === 'desc') {
      return b.comments - a.comments; // Tri décroissant
    }
    return a.comments - b.comments; // Tri croissant (si nécessaire)
  });
};

const sortSelect2 = document.querySelector('#sort-select');
sortSelect2.addEventListener('change', async (event) => {
  const sortOption = event.target.value;

  // Vérifie si l'utilisateur veut trier par nombre de commentaires
  if (sortOption === 'comments-desc') {
    const sortedDeals = sortDealsByComments([...currentDeals], 'desc');
    render(sortedDeals, currentPagination);
  }
});

