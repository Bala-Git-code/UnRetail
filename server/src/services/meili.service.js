import meilisearchClient, { ITEMS_INDEX } from '../../config/meilisearch.js';

const client = meilisearchClient;
export { ITEMS_INDEX };

let isMeiliAvailable = process.env.MEILISEARCH_ENABLED !== 'false';

const isConnectionRefused = (error) => {
  return (
    error.name === 'MeiliSearchCommunicationError' ||
    error.type === 'MeiliSearchCommunicationError' ||
    error.code === 'ECONNREFUSED' ||
    error.message?.includes('fetch failed') ||
    error.message?.includes('has failed') ||
    error.cause?.code === 'ECONNREFUSED'
  );
};

export const syncItemToMeilisearch = async (item) => {
  if (!isMeiliAvailable) return;
  try {
    const index = client.index(ITEMS_INDEX);
    await index.addDocuments([item], { primaryKey: 'id' });
  } catch (error) {
    if (isConnectionRefused(error)) {
      isMeiliAvailable = false;
      // Silent in development; database handles full search fallback
    } else {
      console.warn('[Meilisearch] Sync notice:', error.message || error);
    }
  }
};

export const removeItemFromMeilisearch = async (itemId) => {
  if (!isMeiliAvailable) return;
  try {
    const index = client.index(ITEMS_INDEX);
    await index.deleteDocument(itemId);
  } catch (error) {
    if (isConnectionRefused(error)) {
      isMeiliAvailable = false;
      // Silent in development; database handles deletion
    } else {
      console.warn('[Meilisearch] Delete notice:', error.message || error);
    }
  }
};

export const searchItemsInMeilisearch = async (query, filters) => {
  if (!isMeiliAvailable) return null;
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
      isMeiliAvailable = false;
    }
    return null;
  }
};

export default client;
