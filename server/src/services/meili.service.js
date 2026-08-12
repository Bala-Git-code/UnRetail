import meilisearchClient, { ITEMS_INDEX } from '../../config/meilisearch.js';

const client = meilisearchClient;
export { ITEMS_INDEX };

export const syncItemToMeilisearch = async (item) => {
  try {
    const index = client.index(ITEMS_INDEX);
    await index.addDocuments([item]);
  } catch (error) {
    console.warn('Meilisearch sync failed (is Meilisearch server running?):', error);
  }
};

export const removeItemFromMeilisearch = async (itemId) => {
  try {
    const index = client.index(ITEMS_INDEX);
    await index.deleteDocument(itemId);
  } catch (error) {
    console.warn('Meilisearch delete failed:', error);
  }
};

export const searchItemsInMeilisearch = async (query, filters) => {
  try {
    const index = client.index(ITEMS_INDEX);
    let filterString = '';
    if (filters) {
      const parts = [];
      if (filters.category) parts.push(`category = "${filters.category}"`);
      if (filters.era) parts.push(`era = "${filters.era}"`);
      if (filters.condition) parts.push(`condition = "${filters.condition}"`);
      if (filters.status) parts.push(`status = "${filters.status}"`);
      filterString = parts.join(' AND ');
    }

    const searchResults = await index.search(query, {
      filter: filterString || undefined,
      limit: 20,
    });
    return searchResults.hits;
  } catch (error) {
    console.warn('Meilisearch search error, falling back:', error);
    return null;
  }
};

export default client;
