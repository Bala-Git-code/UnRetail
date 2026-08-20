import meilisearchClient, { ITEMS_INDEX } from '../../config/meilisearch.js';

const client = meilisearchClient;
export { ITEMS_INDEX };

const isConnectionRefused = (error) => {
  return error.code === 'ECONNREFUSED' || 
         error.message?.includes('fetch failed') || 
         error.cause?.code === 'ECONNREFUSED';
};

export const syncItemToMeilisearch = async (item) => {
  try {
    const index = client.index(ITEMS_INDEX);
    await index.addDocuments([item], { primaryKey: 'id' });
  } catch (error) {
    if (isConnectionRefused(error)) {
      console.warn(`[Meilisearch] Sync skipped: Connection refused at ${client.config.host}`);
    } else {
      console.warn('Meilisearch sync failed:', error.message || error);
    }
  }
};

export const removeItemFromMeilisearch = async (itemId) => {
  try {
    const index = client.index(ITEMS_INDEX);
    await index.deleteDocument(itemId);
  } catch (error) {
    if (isConnectionRefused(error)) {
      console.warn(`[Meilisearch] Delete skipped: Connection refused at ${client.config.host}`);
    } else {
      console.warn('Meilisearch delete failed:', error.message || error);
    }
  }
};

export const searchItemsInMeilisearch = async (query, filters) => {
  try {
    const index = client.index(ITEMS_INDEX);
    let filterString = '';
    if (filters) {
      const parts = [];
      if (filters.category) parts.push(`category = "${filters.category}"`);
      if (filters.subcategory) parts.push(`subcategory = "${filters.subcategory}"`);
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
    if (isConnectionRefused(error)) {
      console.warn(`[Meilisearch] Search falling back to DB: Connection refused at ${client.config.host}`);
    } else {
      console.warn('Meilisearch search error, falling back:', error.message || error);
    }
    return null;
  }
};

export default client;
