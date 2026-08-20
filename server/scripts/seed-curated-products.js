import prisma from '../src/prisma/client.js';
import { syncItemToMeilisearch } from '../src/services/meili.service.js';

export const CURATED_PRODUCTS = [
  // ==========================================
  // CATEGORY 1: APPAREL / CLOTHING (5 ITEMS)
  // ==========================================
  {
    id: 'item-apparel-101',
    title: '1990s Vintage Levi 501 Heavyweight Selvedge Denim',
    description: 'Authentic 90s vintage Levi 501s with classic dark indigo wash. Made in USA with 14oz rigid raw-feel denim, red tab detailing, button fly, and straight leg silhouette. No crotch blowout or hem fraying.',
    price: 5499.0,
    category: 'Apparel',
    subcategory: 'Denim & Bottoms',
    brand: "Levi's",
    size: 'W32 L30',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['/images/denim_vintage.png', '/images/thrift_denim.jpg'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-apparel-102',
    title: 'Distressed Harley Davidson Eagle Leather Bomber Jacket',
    description: 'Heavy cowhide vintage biker jacket with natural distress patina on shoulder seams. Features brass Talon zippers, embossed back eagle crest, quilted satin interior, and insulated sleeve cuffs.',
    price: 12500.0,
    category: 'Apparel',
    subcategory: 'Outerwear & Jackets',
    brand: 'Harley Davidson',
    size: 'L',
    era: '80s',
    condition: 'GENTLY_USED',
    images: ['/images/leather_jacket.png', '/images/category_clothings.jpg'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-apparel-103',
    title: '1998 Archival Stussy International Tribe Graphic Tee',
    description: 'Original late 90s single-stitch boxy heavyweight cotton tee. Features archival contrast screenprint graphic with vintage sun fade wash. Collar ribbing remains taut and intact.',
    price: 3200.0,
    category: 'Apparel',
    subcategory: 'Tops & Graphic Tees',
    brand: 'Stussy',
    size: 'XL',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['/images/graphic_tee.png', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-apparel-104',
    title: 'Coogi Australia Textured 3D Wool Knit Sweater',
    description: 'Iconic kaleidoscopic 3D mercerized wool crewneck knit handcrafted in Australia. Intricate wave patterns, vibrant earth and jewel tone weave, relaxed draped fit.',
    price: 14800.0,
    category: 'Apparel',
    subcategory: 'Knitwear & Sweaters',
    brand: 'Coogi',
    size: 'M',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80', '/images/category_clothings.jpg'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-apparel-105',
    title: '1970s Bohemian Prairie Floral Maxi Dress',
    description: 'True 70s archival cottagecore maxi dress with delicate floral ditsy print, corset lace-up bodice, ribbon trim accents, and billowy bishop sleeves.',
    price: 4800.0,
    category: 'Apparel',
    subcategory: 'Dresses & Skirts',
    brand: 'Gunne Sax Style',
    size: 'S',
    era: '70s',
    condition: 'GENTLY_USED',
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', '/images/thrift_curation.jpg'],
    status: 'AVAILABLE',
  },

  // ==========================================
  // CATEGORY 2: ACCESSORIES (5 ITEMS)
  // ==========================================
  {
    id: 'item-acc-201',
    title: 'Archival Mihara Yasuhiro Melted High-Top Canvas Sneakers',
    description: 'Original distorted clay-molded vulcanized rubber sole sneakers. Contrast white topstitching, archival heel stamp, light heel drag with 90% tread life remaining.',
    price: 8900.0,
    category: 'Accessories',
    subcategory: 'Footwear & Sneakers',
    brand: 'Mihara Yasuhiro',
    size: 'OS',
    era: 'Archival',
    condition: 'GENTLY_USED',
    images: ['/images/archival_sneakers.png', '/images/category_accessories.jpg'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-acc-202',
    title: '1990s Prada Tessuto Sport Nylon Mini Messenger Bag',
    description: 'Signature military-grade Pocono nylon shoulder crossbody with enameled triangle logo plaque, Lampo zipper, adjustable webbing strap, and clean interior lining.',
    price: 16500.0,
    category: 'Accessories',
    subcategory: 'Bags & Backpacks',
    brand: 'Prada',
    size: 'OS',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', '/images/category_accessories.jpg'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-acc-203',
    title: 'Vintage Jean Paul Gaultier 56-6106 Steampunk Sunglasses',
    description: 'Rare archival round titanium wire frames with side mesh shields and spring-loaded temple hinges. Fitted with UV400 amber tint mineral glass lenses. Original leather case included.',
    price: 18900.0,
    category: 'Accessories',
    subcategory: 'Eyewear',
    brand: 'Jean Paul Gaultier',
    size: 'OS',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', '/images/category_accessories.jpg'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-acc-204',
    title: '1990s Chrome Hearts Dagger Motif Sterling Silver Ring',
    description: 'Solid 925 sterling silver ring featuring the iconic gothic dagger relief and engraved cross hallmarks. Heavy weight (18g) with natural oxidized patina in crevices.',
    price: 11500.0,
    category: 'Accessories',
    subcategory: 'Jewelry',
    brand: 'Chrome Hearts',
    size: 'OS',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', '/images/category_accessories.jpg'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-acc-205',
    title: 'Vintage 1996 Atlanta Olympics Green Corduroy Strapback Cap',
    description: 'Authentic 1996 Olympic Games commemorative 6-panel corduroy hat with high-density embroidered torch graphic, brass embossed buckle, and green underbrim.',
    price: 2600.0,
    category: 'Accessories',
    subcategory: 'Headwear',
    brand: 'Starter',
    size: 'OS',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80', '/images/thrift_vault.jpg'],
    status: 'AVAILABLE',
  },

  // ====================================================
  // CATEGORY 3: TECH & RETRO ELECTRONICS (5 ITEMS + FRAUD SPEC)
  // ====================================================
  {
    id: 'item-tech-301',
    title: 'Sony Cyber-shot DSC-P100 Silver CCD Digicam Kit',
    description: 'Legendary 2004 5.1 Megapixel CCD sensor camera with Carl Zeiss Vario-Tessar 3x optical glass. Gives that iconic Y2K nostalgic film-like bloom. Includes original lithium battery, Sony Memory Stick Pro, and wall charger.',
    price: 9400.0,
    category: 'Tech & Retro Electronics',
    subcategory: 'Digicams',
    brand: 'Sony',
    size: 'Pocket',
    era: 'Y2K',
    condition: 'LIKE_NEW',
    techConditionGrade: 'Grade A - Mint',
    powerOnStatus: true,
    screenSensorClarity: true,
    portChargingTested: true,
    knownDefectsReported: false,
    knownDefectsDesc: 'Pristine CCD sensor with zero dead pixels. Clean zoom barrel travel.',
    serialNumberImei: 'DSCP100-SN-894210',
    images: ['/images/vintage_camera.png', '/images/thrift_retro_tech.jpg'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-tech-302',
    title: 'Nintendo Game Boy Color - Atomic Purple Translucent Edition',
    description: 'Authentic 1998 translucent casing handheld console. OEM LCD display with polarizer in pristine condition. D-pad, tactile A/B buttons, and headphone jack fully tested.',
    price: 7800.0,
    category: 'Tech & Retro Electronics',
    subcategory: 'Gaming',
    brand: 'Nintendo',
    size: 'Handheld',
    era: '90s',
    condition: 'LIKE_NEW',
    techConditionGrade: 'Grade A - Mint',
    powerOnStatus: true,
    screenSensorClarity: true,
    portChargingTested: true,
    knownDefectsReported: false,
    knownDefectsDesc: 'Crystal-clear sound potentiometer, zero battery compartment corrosion.',
    serialNumberImei: 'GBC-AP-540921',
    images: ['/images/retro_gaming.png', '/images/category_electronics.jpg'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-tech-303',
    title: 'Sony Walkman WM-EX674 Brushed Aluminum Slim Cassette Player',
    description: 'Ultra-slim Japanese domestic market cassette player with Dolby B Noise Reduction, Mega Bass EQ boost, and auto-reverse mechanism. Includes gumstick battery adapter and 3.5mm headphone cable.',
    price: 11200.0,
    category: 'Tech & Retro Electronics',
    subcategory: 'Electronics',
    brand: 'Sony',
    size: 'Slim',
    era: '90s',
    condition: 'GENTLY_USED',
    techConditionGrade: 'Grade B - Good',
    powerOnStatus: true,
    screenSensorClarity: true,
    portChargingTested: true,
    knownDefectsReported: false,
    knownDefectsDesc: 'Fresh high-torque drive belt installed. Fully calibrated playback speed and azimuth.',
    serialNumberImei: 'WM674-88310-JP',
    images: ['/images/retro_audio.png', '/images/thrift_retro_tech.jpg'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-tech-304',
    title: 'Canon PowerShot SD1000 Digital ELPH (Matte Silver Boxy)',
    description: 'The holy grail of minimalist industrial design digicams. Pure boxy aluminum aesthetic, 7.1MP CCD sensor for dreamy warm flash photos, optical viewfinder, and SD card compatibility.',
    price: 8600.0,
    category: 'Tech & Retro Electronics',
    subcategory: 'Digicams',
    brand: 'Canon',
    size: 'Pocket',
    era: 'Y2K',
    condition: 'LIKE_NEW',
    techConditionGrade: 'Grade A - Mint',
    powerOnStatus: true,
    screenSensorClarity: true,
    portChargingTested: true,
    knownDefectsReported: false,
    knownDefectsDesc: 'Flawless DIGIC III image processor, razor sharp optics with original NB-4L battery.',
    serialNumberImei: 'SD1000-CN-318902',
    images: ['/images/thrift_retro_tech.jpg', '/images/vintage_camera.png'],
    status: 'AVAILABLE',
  },
  {
    id: 'item-tech-305',
    title: 'Sega Dreamcast Japanese Edition Console & Visual Memory Unit (VMU)',
    description: 'Archival 128-bit Sega console with 1x OEM controller, 1x LCD Visual Memory Unit (VMU) with fresh CR2032 batteries, AV composite cables, and universal power supply.',
    price: 13500.0,
    category: 'Tech & Retro Electronics',
    subcategory: 'Gaming',
    brand: 'Sega',
    size: 'Standard Desktop',
    era: '90s',
    condition: 'LIKE_NEW',
    techConditionGrade: 'Grade A - Mint',
    powerOnStatus: true,
    screenSensorClarity: true,
    portChargingTested: true,
    knownDefectsReported: false,
    knownDefectsDesc: 'Laser calibrated and reads both GD-ROMs and CD-Rs flawlessly. Quiet fan bearing.',
    serialNumberImei: 'HKT-3000-SEGA-9921',
    images: ['/images/retro_gaming.png', '/images/category_electronics.jpg'],
    status: 'AVAILABLE',
  },
];

async function seedCuratedItems() {
  console.log('🚀 Populating Curated Authentic Products (5 per Category)...\n');

  try {
    // 1. Ensure Primary Verified Merchant Shops exist for all merchant accounts
    const merchantEmails = [
      'suryaprk165@gmail.com',
      'rseenivasagam2015@gmail.com',
      'aarav@relicvintage.in',
    ];

    for (const email of merchantEmails) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        // Upgrade to APPROVED MERCHANT if not already
        await prisma.user.update({
          where: { email },
          data: {
            role: 'MERCHANT',
            merchantStatus: 'APPROVED',
            approvedAt: new Date(),
          },
        });

        // Ensure user has a shop attached
        const existingShop = await prisma.shop.findFirst({ where: { ownerId: user.id } });
        if (!existingShop) {
          const shopSlug = `boutique-${user.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;
          await prisma.shop.create({
            data: {
              ownerId: user.id,
              shopName: `${user.fullName}'s Vintage Lab`,
              slug: shopSlug,
              city: 'Mumbai',
              address: 'Bandra West, Boutique Lane',
              isVerified: true,
            },
          });
          console.log(`✨ Created verified boutique shop for ${email}`);
        }
      }
    }

    // Get primary default shop
    let primaryShop = await prisma.shop.findFirst({
      where: { slug: 'relic-vintage' },
    });

    if (!primaryShop) {
      primaryShop = await prisma.shop.findFirst();
    }

    if (!primaryShop) {
      console.error('❌ No shop found to associate items with.');
      return;
    }

    console.log(`🏪 Attaching products to shop: "${primaryShop.shopName}" (${primaryShop.id})\n`);

    // 2. Clean old item IDs and insert curated items
    let count = 0;
    for (const prod of CURATED_PRODUCTS) {
      const itemData = {
        ...prod,
        shopId: primaryShop.id,
      };

      const created = await prisma.item.upsert({
        where: { id: itemData.id },
        update: itemData,
        create: itemData,
        include: { shop: true },
      });

      // Sync with Meilisearch
      try {
        await syncItemToMeilisearch(created);
      } catch (meiliErr) {
        // Ignore meilisearch if not running locally
      }

      console.log(`✅ [${prod.category.padEnd(26)}] ${prod.title} (₹${prod.price})`);
      count++;
    }

    console.log(`\n🎉 Successfully added and verified ${count} products across all categories!`);
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seedCuratedItems();
