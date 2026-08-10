import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'your-service-role-key-here';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting Unretail database seeding...');

  try {
    // 1. Seed Sample Merchant Profiles
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .upsert([
        {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'merchant1@relicvintage.com',
          full_name: 'Marcus Vance',
          role: 'merchant',
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          email: 'merchant2@retrovault.com',
          full_name: 'Elena Rostova',
          role: 'merchant',
        },
      ])
      .select();

    if (profileErr) {
      console.warn('Profile seeding warning (Note: run schema.sql first):', profileErr.message);
    } else {
      console.log('✅ Profiles seeded:', profileData?.length);
    }

    // 2. Seed Sample Shops
    const { data: shopData, error: shopErr } = await supabase
      .from('shops')
      .upsert([
        {
          id: '10000000-0000-0000-0000-000000000001',
          owner_id: '00000000-0000-0000-0000-000000000001',
          name: 'Relic Vintage Co.',
          slug: 'relic-vintage',
          description: 'Specializing in 80s & 90s band tees, rare denim, and iconic American workwear.',
          location: 'Portland, OR',
          verified: true,
        },
        {
          id: '10000000-0000-0000-0000-000000000002',
          owner_id: '00000000-0000-0000-0000-000000000002',
          name: 'Retro Vault',
          slug: 'retro-vault',
          description: 'Heavyweight leather outerwear, motorcycle jackets, and authentic vintage boots.',
          location: 'Austin, TX',
          verified: true,
        },
      ])
      .select();

    if (shopErr) {
      console.warn('Shop seeding warning:', shopErr.message);
    } else {
      console.log('✅ Shops seeded:', shopData?.length);
    }

    // 3. Seed Sample Thrift Items
    const { data: itemData, error: itemErr } = await supabase
      .from('items')
      .upsert([
        {
          id: '20000000-0000-0000-0000-000000000001',
          shop_id: '10000000-0000-0000-0000-000000000001',
          title: '1990s Vintage Levi 501 Heavyweight Denim',
          category: 'Apparel',
          condition: 'Excellent',
          price: 68.0,
          description: 'Authentic vintage 501 jeans with natural wash fading.',
          status: 'active',
          images: ['https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80'],
        },
        {
          id: '20000000-0000-0000-0000-000000000002',
          shop_id: '10000000-0000-0000-0000-000000000002',
          title: 'Distressed Harley Davidson Leather Jacket',
          category: 'Outerwear',
          condition: 'Good',
          price: 185.0,
          description: 'Heavyweight distressed vintage leather jacket.',
          status: 'active',
          images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'],
        },
      ])
      .select();

    if (itemErr) {
      console.warn('Item seeding warning:', itemErr.message);
    } else {
      console.log('✅ Thrift Items seeded:', itemData?.length);
    }

    console.log('🎉 Seeding complete!');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seedDatabase();
