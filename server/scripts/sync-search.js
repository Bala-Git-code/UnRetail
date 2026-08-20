import prisma from '../src/prisma/client.js';
import { syncItemToMeilisearch } from '../src/services/meili.service.js';
import { initMeilisearchIndex } from '../config/meilisearch.js';

async function syncSearchIndex() {
  console.log('🔍 Synchronizing all available items to Meilisearch index...');
  await initMeilisearchIndex();

  try {
    const items = await prisma.item.findMany({
      where: { status: 'AVAILABLE' },
      include: { shop: true },
    });

    console.log(`Found ${items.length} items to index.`);

    for (const item of items) {
      await syncItemToMeilisearch(item);
    }

    console.log('✅ Search index synchronization complete!');
  } catch (err) {
    console.warn('Search index sync warning:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

syncSearchIndex();
