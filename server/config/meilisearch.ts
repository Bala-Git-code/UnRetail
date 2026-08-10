import { MeiliSearch } from 'meilisearch';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700';
const apiKey = process.env.MEILISEARCH_MASTER_KEY || 'masterKey123';

export const meilisearchClient = new MeiliSearch({
  host,
  apiKey,
});

export const ITEMS_INDEX = 'thrift_items';

export async function initMeilisearchIndex() {
  try {
    const index = meilisearchClient.index(ITEMS_INDEX);
    await index.updateSearchableAttributes(['title', 'description', 'category', 'condition']);
    await index.updateFilterableAttributes(['category', 'condition', 'price', 'status', 'shop_id']);
    await index.updateSortableAttributes(['price', 'created_at']);
    console.log(`[Meilisearch] Index '${ITEMS_INDEX}' initialized successfully.`);
  } catch (error) {
    console.warn(`[Meilisearch] Connection fallback - make sure Meilisearch service is running at ${host}`);
  }
}
