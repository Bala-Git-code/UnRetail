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
    const seedItems = [
      {
        id: 'item-101',
        shopId: shop.id,
        title: '1990s Vintage Levi 501 Heavyweight Denim',
        description: 'Authentic 90s vintage Levi 501s with dark indigo wash. Made in USA with 14oz rigid denim.',
        price: 5499.0,
        category: 'Apparel',
        subcategory: 'Denim & Bottoms',
        size: 'W32 L30',
        era: '90s',
        condition: 'LIKE_NEW',
        images: ['/images/denim_vintage.png'],
        status: 'AVAILABLE',
      },
      {
        id: 'item-102',
        shopId: shop.id,
        title: 'Distressed Harley Davidson Leather Bomber Jacket',
        description: 'Heavy patina genuine leather bomber jacket from late 80s. Authentic motorcycle heritage piece.',
        price: 12500.0,
        category: 'Apparel',
        subcategory: 'Outerwear & Jackets',
        size: 'L',
        era: '80s',
        condition: 'GENTLY_USED',
        images: ['/images/leather_jacket.png'],
        status: 'AVAILABLE',
      },
      {
        id: 'item-104',
        shopId: shop.id,
        title: 'Archival Japanese-Release High-Top Sneakers',
        description: 'Ultra-rare archival high-top canvas sneakers with vulcanized rubber sole and vintage patina.',
        price: 8900.0,
        category: 'Accessories',
        subcategory: 'Footwear & Sneakers',
        size: 'US 10',
        era: 'Archival',
        condition: 'GENTLY_USED',
        images: ['/images/archival_sneakers.png'],
        status: 'AVAILABLE',
      },
      {
        id: 'item-105',
        shopId: shop.id,
        title: 'Sony Cyber-shot DSC-P100 Silver Digicam',
        description: 'Legendary 2004 CCD sensor 5.1MP digicam with Carl Zeiss Vario-Tessar 3x optical zoom. Includes original battery, Memory Stick, and charger.',
        price: 9400.0,
        category: 'Tech & Retro Electronics',
        subcategory: 'Digicams',
        size: 'Pocket',
        era: 'Y2K',
        condition: 'LIKE_NEW',
        techConditionGrade: 'Grade A - Mint',
        powerOnStatus: true,
        screenSensorClarity: true,
        portChargingTested: true,
        knownDefectsReported: false,
        knownDefectsDesc: 'Pristine sensor and optics with zero dead pixels.',
        serialNumberImei: 'DSCP100-SN-894210',
        images: ['/images/vintage_camera.png'],
        status: 'AVAILABLE',
      },
      {
        id: 'item-106',
        shopId: shop.id,
        title: 'Nintendo Game Boy Color - Atomic Purple Edition',
        description: 'Archival 1998 translucent atomic purple handheld with authentic casing and crisp clean LCD panel. Buttons and speaker fully tested.',
        price: 7800.0,
        category: 'Tech & Retro Electronics',
        subcategory: 'Gaming',
        size: 'Handheld',
        era: '90s',
        condition: 'LIKE_NEW',
        techConditionGrade: 'Grade A - Mint',
        powerOnStatus: true,
        screenSensorClarity: true,
        portChargingTested: true,
        knownDefectsReported: false,
        knownDefectsDesc: 'Flawless sound output, clean battery contacts with zero corrosion.',
        serialNumberImei: 'GBC-AP-540921',
        images: ['/images/retro_gaming.png'],
        status: 'AVAILABLE',
      },
    ];

    for (const itemData of seedItems) {
      await prisma.item.upsert({
        where: { id: itemData.id },
        update: itemData,
        create: itemData,
      });
    }

    console.log('✅ Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding warning (database connection or table structure setup required):', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
