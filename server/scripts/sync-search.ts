import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { meilisearchClient, ITEMS_INDEX, initMeilisearchIndex } from '../config/meilisearch.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'your-service-role-key-here';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncSearchIndex() {
  console.log('🔄 Starting Meilisearch sync from Supabase...');

  try {
    await initMeilisearchIndex();

    // Fetch active thrift items joined with shop details
    const { data: items, error } = await supabase
      .from('items')
      .select(`
        id,
        title,
        category,
        condition,
        price,
        description,
        images,
        status,
        created_at,
        shops (
          id,
          name,
          slug
        )
      `)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching items for search sync:', error.message);
      return;
    }

    if (!items || items.length === 0) {
      console.log('ℹ️ No active items to index.');
      return;
    }

    const formattedDocs = items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      condition: item.condition,
      price: item.price,
      description: item.description,
      image: item.images?.[0] || '',
      shop_id: (item.shops as any)?.id || '',
      shop_name: (item.shops as any)?.name || 'Independent Vendor',
      shop_slug: (item.shops as any)?.slug || '',
      created_at: item.created_at,
    }));

    const index = meilisearchClient.index(ITEMS_INDEX);
    const response = await index.addDocuments(formattedDocs);
    console.log(`✅ Indexing task queued with Meilisearch (Task ID: ${response.taskUid})`);
    console.log(`Synced ${formattedDocs.length} items to index '${ITEMS_INDEX}'.`);
  } catch (err) {
    console.error('Meilisearch sync error:', err);
  }
}

syncSearchIndex();
