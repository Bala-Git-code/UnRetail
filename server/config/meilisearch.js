import { MeiliSearch } from 'meilisearch';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700';
const apiKey = process.env.MEILISEARCH_ADMIN_KEY || process.env.MEILISEARCH_MASTER_KEY || 'masterKey';

export const meilisearchClient = new MeiliSearch({
  host,
  apiKey,
});

export const ITEMS_INDEX = 'items';

export async function initMeilisearchIndex() {
  try {
    if (process.env.MEILISEARCH_ENABLED === 'false') {
      return;
    }
    // Perform a quick health check to see if Meilisearch is online
    await meilisearchClient.health();

    try {
      await meilisearchClient.createIndex(ITEMS_INDEX, { primaryKey: 'id' });
    } catch (e) {
      // Index might already exist, which is fine
    }
    const index = meilisearchClient.index(ITEMS_INDEX);
    await index.updateSearchableAttributes(['title', 'description', 'category', 'condition']);
    await index.updateFilterableAttributes(['category', 'subcategory', 'condition', 'era', 'price', 'status', 'shop_id']);
    await index.updateSortableAttributes(['price', 'created_at']);
    console.log(`[Meilisearch] Index '${ITEMS_INDEX}' initialized successfully.`);
  } catch (error) {
    // Only display connection failure logs in production environments
    if (process.env.NODE_ENV === 'production') {
      console.warn(`[Meilisearch] Connection fallback - make sure Meilisearch service is running at ${host}`);
    }
  }
}

export default meilisearchClient;
