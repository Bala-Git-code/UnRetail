import prisma from '../src/prisma/client.js';
import { CURATED_PRODUCTS } from './seed-curated-products.js';

async function seed() {
  console.log('🌱 Seeding UnRetail PostgreSQL database with full curated catalog...');

  try {
    // 1. Seed Users & Merchant Accounts
    const merchantUser = await prisma.user.upsert({
      where: { email: 'aarav@relicvintage.in' },
      update: { role: 'MERCHANT', merchantStatus: 'APPROVED' },
      create: {
        email: 'aarav@relicvintage.in',
        fullName: 'Aarav Patel',
        role: 'MERCHANT',
        merchantStatus: 'APPROVED',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
    });

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@unretail.in' },
      update: {},
      create: {
        email: 'admin@unretail.in',
        fullName: 'Sarah Lin',
        role: 'ADMIN',
      },
    });

    // 2. Seed Shop
    const shop = await prisma.shop.upsert({
      where: { slug: 'relic-vintage' },
      update: {},
      create: {
        ownerId: merchantUser.id,
        shopName: 'Relic Vintage Co.',
        slug: 'relic-vintage',
        city: 'Mumbai',
        address: '42 Bandra West, Hill Road',
        isVerified: true,
      },
    });

    // 3. Seed Items (5 in Apparel, 5 in Accessories, 5 in Tech & Retro Electronics)
    for (const prod of CURATED_PRODUCTS) {
      const itemData = {
        ...prod,
        shopId: shop.id,
      };

      await prisma.item.upsert({
        where: { id: itemData.id },
        update: itemData,
        create: itemData,
      });
    }

    console.log(`✅ Seeding completed successfully! (15 authentic curated products loaded)`);
  } catch (err) {
    console.error('Seeding error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
