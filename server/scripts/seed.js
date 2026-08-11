import prisma from '../src/prisma/client.js';

async function seed() {
  console.log('🌱 Seeding UnRetail PostgreSQL database...');

  try {
    // 1. Seed Users
    const merchantUser = await prisma.user.upsert({
      where: { email: 'aarav@relicvintage.in' },
      update: {},
      create: {
        email: 'aarav@relicvintage.in',
        fullName: 'Aarav Patel',
        role: 'MERCHANT',
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

    // 3. Seed Items
    await prisma.item.upsert({
      where: { id: 'item-101' },
      update: {},
      create: {
        id: 'item-101',
        shopId: shop.id,
        title: '1990s Vintage Levi 501 Heavyweight Denim',
        description: 'Authentic 90s vintage Levi 501s with dark indigo wash. Made in USA with 14oz rigid denim.',
        price: 68.0,
        category: 'Apparel',
        size: 'W32 L30',
        era: '90s',
        condition: 'LIKE_NEW',
        images: ['https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'],
        status: 'AVAILABLE',
      },
    });

    console.log('✅ Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding warning (database connection or table structure setup required):', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
