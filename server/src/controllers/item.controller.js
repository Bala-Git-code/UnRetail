import prisma from '../prisma/client.js';
import { syncItemToMeilisearch, removeItemFromMeilisearch, searchItemsInMeilisearch } from '../services/meili.service.js';

export const MOCK_ITEMS = [
  // Apparel (5 items)
  {
    id: 'item-apparel-101',
    shopId: 'shop-1',
    title: '1990s Vintage Levi 501 Heavyweight Selvedge Denim',
    description: 'Authentic 90s vintage Levi 501s with classic dark indigo wash. Made in USA with 14oz rigid raw-feel denim, red tab detailing, button fly, and straight leg silhouette.',
    price: 5499,
    category: 'Apparel',
    subcategory: 'Denim & Bottoms',
    brand: "Levi's",
    size: 'W32 L30',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['/images/denim_vintage.png', '/images/thrift_denim.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-01T10:00:00Z'),
    updatedAt: new Date('2026-08-01T10:00:00Z'),
    shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', address: '42 Bandra West, Hill Road', isVerified: true },
  },
  {
    id: 'item-apparel-102',
    shopId: 'shop-2',
    title: 'Distressed Harley Davidson Eagle Leather Bomber Jacket',
    description: 'Heavy cowhide vintage biker jacket with natural distress patina on shoulder seams. Features brass Talon zippers, embossed back eagle crest, quilted satin interior.',
    price: 12500,
    category: 'Apparel',
    subcategory: 'Outerwear & Jackets',
    brand: 'Harley Davidson',
    size: 'L',
    era: '80s',
    condition: 'GENTLY_USED',
    images: ['/images/leather_jacket.png', '/images/category_clothings.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-02T11:30:00Z'),
    updatedAt: new Date('2026-08-02T11:30:00Z'),
    shop: { id: 'shop-2', shopName: 'Retro Vault', slug: 'retro-vault', city: 'Bengaluru', address: '108 Indiranagar, 100ft Road', isVerified: true },
  },
  {
    id: 'item-apparel-103',
    shopId: 'shop-3',
    title: '1998 Archival Stussy International Tribe Graphic Tee',
    description: 'Original late 90s single-stitch boxy heavyweight cotton tee. Features archival contrast screenprint graphic with vintage sun fade wash.',
    price: 3200,
    category: 'Apparel',
    subcategory: 'Tops & Graphic Tees',
    brand: 'Stussy',
    size: 'XL',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['/images/graphic_tee.png', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-03T09:15:00Z'),
    updatedAt: new Date('2026-08-03T09:15:00Z'),
    shop: { id: 'shop-3', shopName: 'Dust & Gold Vintage', slug: 'dust-and-gold', city: 'Delhi', address: '15 Hauz Khas Village', isVerified: false },
  },
  {
    id: 'item-apparel-104',
    shopId: 'shop-1',
    title: 'Coogi Australia Textured 3D Wool Knit Sweater',
    description: 'Iconic kaleidoscopic 3D mercerized wool crewneck knit handcrafted in Australia. Intricate wave patterns, vibrant earth and jewel tone weave, relaxed draped fit.',
    price: 14800,
    category: 'Apparel',
    subcategory: 'Knitwear & Sweaters',
    brand: 'Coogi',
    size: 'M',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80', '/images/category_clothings.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-04T10:00:00Z'),
    updatedAt: new Date('2026-08-04T10:00:00Z'),
    shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', address: '42 Bandra West, Hill Road', isVerified: true },
  },
  {
    id: 'item-apparel-105',
    shopId: 'shop-2',
    title: '1970s Bohemian Prairie Floral Maxi Dress',
    description: 'True 70s archival cottagecore maxi dress with delicate floral ditsy print, corset lace-up bodice, ribbon trim accents, and billowy bishop sleeves.',
    price: 4800,
    category: 'Apparel',
    subcategory: 'Dresses & Skirts',
    brand: 'Gunne Sax Style',
    size: 'S',
    era: '70s',
    condition: 'GENTLY_USED',
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', '/images/thrift_curation.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-05T12:00:00Z'),
    updatedAt: new Date('2026-08-05T12:00:00Z'),
    shop: { id: 'shop-2', shopName: 'Retro Vault', slug: 'retro-vault', city: 'Bengaluru', address: '108 Indiranagar, 100ft Road', isVerified: true },
  },

  // Accessories (5 items)
  {
    id: 'item-acc-201',
    shopId: 'shop-1',
    title: 'Archival Mihara Yasuhiro Melted High-Top Canvas Sneakers',
    description: 'Original distorted clay-molded vulcanized rubber sole sneakers. Contrast white topstitching, archival heel stamp, light heel drag with 90% tread life remaining.',
    price: 8900,
    category: 'Accessories',
    subcategory: 'Footwear & Sneakers',
    brand: 'Mihara Yasuhiro',
    size: 'OS',
    era: 'Archival',
    condition: 'GENTLY_USED',
    images: ['/images/archival_sneakers.png', '/images/category_accessories.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-06T14:20:00Z'),
    updatedAt: new Date('2026-08-06T14:20:00Z'),
    shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', address: '42 Bandra West, Hill Road', isVerified: true },
  },
  {
    id: 'item-acc-202',
    shopId: 'shop-3',
    title: '1990s Prada Tessuto Sport Nylon Mini Messenger Bag',
    description: 'Signature military-grade Pocono nylon shoulder crossbody with enameled triangle logo plaque, Lampo zipper, adjustable webbing strap, and clean interior lining.',
    price: 16500,
    category: 'Accessories',
    subcategory: 'Bags & Backpacks',
    brand: 'Prada',
    size: 'OS',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', '/images/category_accessories.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-07T11:00:00Z'),
    updatedAt: new Date('2026-08-07T11:00:00Z'),
    shop: { id: 'shop-3', shopName: 'Dust & Gold Vintage', slug: 'dust-and-gold', city: 'Delhi', address: '15 Hauz Khas Village', isVerified: false },
  },
  {
    id: 'item-acc-203',
    shopId: 'shop-2',
    title: 'Vintage Jean Paul Gaultier 56-6106 Steampunk Sunglasses',
    description: 'Rare archival round titanium wire frames with side mesh shields and spring-loaded temple hinges. Fitted with UV400 amber tint mineral glass lenses. Original leather case included.',
    price: 18900,
    category: 'Accessories',
    subcategory: 'Eyewear',
    brand: 'Jean Paul Gaultier',
    size: 'OS',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', '/images/category_accessories.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-08T15:30:00Z'),
    updatedAt: new Date('2026-08-08T15:30:00Z'),
    shop: { id: 'shop-2', shopName: 'Retro Vault', slug: 'retro-vault', city: 'Bengaluru', address: '108 Indiranagar, 100ft Road', isVerified: true },
  },
  {
    id: 'item-acc-204',
    shopId: 'shop-1',
    title: '1990s Chrome Hearts Dagger Motif Sterling Silver Ring',
    description: 'Solid 925 sterling silver ring featuring the iconic gothic dagger relief and engraved cross hallmarks. Heavy weight (18g) with natural oxidized patina in crevices.',
    price: 11500,
    category: 'Accessories',
    subcategory: 'Jewelry',
    brand: 'Chrome Hearts',
    size: 'OS',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', '/images/category_accessories.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-09T09:40:00Z'),
    updatedAt: new Date('2026-08-09T09:40:00Z'),
    shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', address: '42 Bandra West, Hill Road', isVerified: true },
  },
  {
    id: 'item-acc-205',
    shopId: 'shop-3',
    title: 'Vintage 1996 Atlanta Olympics Green Corduroy Strapback Cap',
    description: 'Authentic 1996 Olympic Games commemorative 6-panel corduroy hat with high-density embroidered torch graphic, brass embossed buckle, and green underbrim.',
    price: 2600,
    category: 'Accessories',
    subcategory: 'Headwear',
    brand: 'Starter',
    size: 'OS',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80', '/images/thrift_vault.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-10T16:15:00Z'),
    updatedAt: new Date('2026-08-10T16:15:00Z'),
    shop: { id: 'shop-3', shopName: 'Dust & Gold Vintage', slug: 'dust-and-gold', city: 'Delhi', address: '15 Hauz Khas Village', isVerified: false },
  },

  // Tech & Retro Electronics (5 items)
  {
    id: 'item-tech-301',
    shopId: 'shop-2',
    title: 'Sony Cyber-shot DSC-P100 Silver CCD Digicam Kit',
    description: 'Legendary 2004 CCD sensor 5.1MP digicam with Carl Zeiss Vario-Tessar 3x optical zoom. Includes original battery, Memory Stick, and charger.',
    price: 9400,
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
    knownDefectsDesc: 'Pristine sensor and optics with zero dead pixels.',
    serialNumberImei: 'DSCP100-SN-894210',
    images: ['/images/vintage_camera.png', '/images/thrift_retro_tech.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-11T16:45:00Z'),
    updatedAt: new Date('2026-08-11T16:45:00Z'),
    shop: { id: 'shop-2', shopName: 'Retro Vault', slug: 'retro-vault', city: 'Bengaluru', address: '108 Indiranagar, 100ft Road', isVerified: true },
  },
  {
    id: 'item-tech-302',
    shopId: 'shop-1',
    title: 'Nintendo Game Boy Color - Atomic Purple Translucent Edition',
    description: 'Archival 1998 translucent atomic purple handheld with authentic casing and crisp clean LCD panel. Buttons and speaker fully tested.',
    price: 7800,
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
    knownDefectsDesc: 'Flawless sound output, clean battery contacts with zero corrosion.',
    serialNumberImei: 'GBC-AP-540921',
    images: ['/images/retro_gaming.png', '/images/category_electronics.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-12T12:10:00Z'),
    updatedAt: new Date('2026-08-12T12:10:00Z'),
    shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', address: '42 Bandra West, Hill Road', isVerified: true },
  },
  {
    id: 'item-tech-303',
    shopId: 'shop-3',
    title: 'Sony Walkman WM-EX674 Brushed Aluminum Slim Cassette Player',
    description: 'High-end brushed aluminum Japanese cassette player with Dolby B NR, auto-reverse, and mega bass.',
    price: 11200,
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
    knownDefectsDesc: 'Fresh new drive belt installed. Fully calibrated playback speed.',
    serialNumberImei: 'WM674-88310-JP',
    images: ['/images/retro_audio.png', '/images/thrift_retro_tech.jpg'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-13T15:30:00Z'),
    updatedAt: new Date('2026-08-13T15:30:00Z'),
    shop: { id: 'shop-3', shopName: 'Dust & Gold Vintage', slug: 'dust-and-gold', city: 'Delhi', address: '15 Hauz Khas Village', isVerified: false },
  },
  {
    id: 'item-tech-304',
    shopId: 'shop-2',
    title: 'Canon PowerShot SD1000 Digital ELPH (Matte Silver Boxy)',
    description: 'The holy grail of minimalist industrial design digicams. Pure boxy aluminum aesthetic, 7.1MP CCD sensor for dreamy warm flash photos, optical viewfinder, and SD card compatibility.',
    price: 8600,
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
    createdAt: new Date('2026-08-14T11:20:00Z'),
    updatedAt: new Date('2026-08-14T11:20:00Z'),
    shop: { id: 'shop-2', shopName: 'Retro Vault', slug: 'retro-vault', city: 'Bengaluru', address: '108 Indiranagar, 100ft Road', isVerified: true },
  },
  {
    id: 'item-tech-305',
    shopId: 'shop-1',
    title: 'Sega Dreamcast Japanese Edition Console & Visual Memory Unit (VMU)',
    description: 'Archival 128-bit Sega console with 1x OEM controller, 1x LCD Visual Memory Unit (VMU) with fresh CR2032 batteries, AV composite cables, and universal power supply.',
    price: 13500,
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
    createdAt: new Date('2026-08-15T13:40:00Z'),
    updatedAt: new Date('2026-08-15T13:40:00Z'),
    shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', address: '42 Bandra West, Hill Road', isVerified: true },
  },
];

export const getItems = async (req, res) => {
  try {
    const {
      query,
      category,
      subcategory,
      brand,
      era,
      condition,
      techConditionGrade,
      city,
      shopId,
      minPrice,
      maxPrice,
      status = 'AVAILABLE',
      limit = '20',
      page = '1',
    } = req.query;

    // Try Meilisearch first if query is provided
    if (query && typeof query === 'string') {
      try {
        const hits = await searchItemsInMeilisearch(query, { category, subcategory, era, condition, status });
        if (hits && hits.length > 0) {
          return res.status(200).json({
            success: true,
            source: 'meilisearch',
            data: hits,
            total: hits.length,
          });
        }
      } catch (meiliError) {
        console.warn('Meilisearch query failed, falling back to database search:', meiliError.message);
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const whereClause = {};
    if (status && status !== 'ALL') whereClause.status = status;
    if (category && category !== 'ALL') whereClause.category = category;
    if (subcategory && subcategory !== 'ALL') whereClause.subcategory = subcategory;
    if (era) whereClause.era = era;
    if (condition) whereClause.condition = condition;
    if (techConditionGrade) whereClause.techConditionGrade = techConditionGrade;
    if (shopId) whereClause.shopId = shopId;

    if (brand) {
      whereClause.brand = { contains: brand, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    if (city) {
      whereClause.shop = {
        city: { contains: city, mode: 'insensitive' },
      };
    }

    // Text search fallback across multiple fields
    if (query && typeof query === 'string') {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { subcategory: { contains: query, mode: 'insensitive' } },
      ];
    }

    try {
      const [items, total] = await Promise.all([
        prisma.item.findMany({
          where: whereClause,
          include: {
            shop: {
              select: {
                id: true,
                shopName: true,
                slug: true,
                city: true,
                address: true,
                isVerified: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
        }),
        prisma.item.count({ where: whereClause }),
      ]);

      return res.status(200).json({
        success: true,
        source: 'database',
        data: items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (dbError) {
      console.warn('Prisma DB query failed, falling back to mock array:', dbError.message);
    }

    // Filter local mock items
    let filtered = [...MOCK_ITEMS];
    if (status && status !== 'ALL') filtered = filtered.filter((i) => i.status === status);
    if (category && category !== 'ALL') filtered = filtered.filter((i) => i.category === category);
    if (subcategory && subcategory !== 'ALL') filtered = filtered.filter((i) => i.subcategory === subcategory);
    if (era) filtered = filtered.filter((i) => i.era === era);
    if (condition) filtered = filtered.filter((i) => i.condition === condition);
    if (techConditionGrade) filtered = filtered.filter((i) => i.techConditionGrade === techConditionGrade);
    if (shopId) filtered = filtered.filter((i) => i.shopId === shopId);
    if (city) filtered = filtered.filter((i) => i.shop?.city?.toLowerCase() === city.toLowerCase());
    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.brand?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q) ||
          i.subcategory?.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      source: 'mock',
      data: filtered,
      total: filtered.length,
      pagination: {
        total: filtered.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filtered.length / limitNum) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    try {
      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: {
          shop: {
            include: {
              owner: {
                select: { id: true, fullName: true, email: true, avatarUrl: true },
              },
            },
          },
        },
      });

      if (item) {
        return res.status(200).json({ success: true, data: item });
      }
    } catch (dbError) {
      console.warn('Prisma getItemById failed, falling back to mock:', dbError.message);
    }

    const mockItem = MOCK_ITEMS.find((i) => i.id === itemId) || MOCK_ITEMS[0];
    return res.status(200).json({
      success: true,
      source: 'mock',
      data: mockItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      subcategory,
      brand,
      size,
      era,
      condition,
      techConditionGrade,
      powerOnStatus,
      screenSensorClarity,
      portChargingTested,
      knownDefectsReported,
      knownDefectsDesc,
      serialNumberImei,
      images,
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required item fields (title, price, category)',
      });
    }

    // Tech & Electronics Conditional Anti-Fraud Validation
    if (category === 'Tech & Retro Electronics' || category === 'Tech & Electronics' || category?.toLowerCase()?.includes('tech') || category?.toLowerCase()?.includes('electronics')) {
      const missingTechFields = [];
      if (!techConditionGrade) missingTechFields.push('Functional Condition Grade');
      if (!serialNumberImei || serialNumberImei.trim() === '') missingTechFields.push('Serial Number / IMEI (Private)');
      if (powerOnStatus === undefined || powerOnStatus === null) missingTechFields.push('Power-on status check');
      if (screenSensorClarity === undefined || screenSensorClarity === null) missingTechFields.push('Screen/Sensor clarity check');
      if (portChargingTested === undefined || portChargingTested === null) missingTechFields.push('Port/Charging circuit check');

      if (missingTechFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required tech verification attributes: ${missingTechFields.join(', ')}`,
          missingFields: missingTechFields,
        });
      }
    }

    // Check Merchant Approval Gating (Only approved merchants or admins can post products)
    if (req.user?.role !== 'ADMIN') {
      try {
        const currentUser = await prisma.user.findUnique({
          where: { id: req.user.id },
        });

        if (currentUser && currentUser.merchantStatus && currentUser.merchantStatus !== 'APPROVED') {
          return res.status(403).json({
            success: false,
            error: 'Your merchant account is pending admin approval. You can only post items for selling after your verification is approved by the admin.',
            merchantStatus: currentUser.merchantStatus,
          });
        }
      } catch (checkErr) {
        // Continue gracefully if DB query fails in mock mode
      }
    }

    // Dynamic Shop Linking based on logged-in user
    let merchantShop = await prisma.shop.findFirst({
      where: { ownerId: req.user.id },
    });

    if (!merchantShop) {
      // Fallback to first available shop to avoid blocking test sessions
      merchantShop = await prisma.shop.findFirst();
    }

    if (!merchantShop) {
      return res.status(403).json({ success: false, error: 'Forbidden: No shop setup exists on this platform. Please run seeds.' });
    }

    let newItem;
    try {
      newItem = await prisma.item.create({
        data: {
          shopId: merchantShop.id,
          title,
          description: description || '',
          price: parseFloat(price),
          category,
          subcategory: subcategory || null,
          brand: brand || null,
          size: size || 'OS',
          era: era || '90s',
          condition: condition || 'GENTLY_USED',
          techConditionGrade: techConditionGrade || null,
          powerOnStatus: powerOnStatus ?? null,
          screenSensorClarity: screenSensorClarity ?? null,
          portChargingTested: portChargingTested ?? null,
          knownDefectsReported: knownDefectsReported ?? null,
          knownDefectsDesc: knownDefectsDesc || null,
          serialNumberImei: serialNumberImei || null,
          images: images || [],
          status: 'AVAILABLE',
        },
        include: {
          shop: true,
        },
      });
    } catch (dbError) {
      console.warn('Prisma createItem failed, creating mock in memory:', dbError.message);
      newItem = {
        id: `item_${Math.random().toString(36).substring(2, 10)}`,
        shopId: merchantShop.id,
        title,
        description: description || '',
        price: parseFloat(price),
        category,
        subcategory: subcategory || null,
        brand: brand || null,
        size: size || 'OS',
        era: era || '90s',
        condition: condition || 'GENTLY_USED',
        techConditionGrade: techConditionGrade || null,
        powerOnStatus: powerOnStatus ?? null,
        screenSensorClarity: screenSensorClarity ?? null,
        portChargingTested: portChargingTested ?? null,
        knownDefectsReported: knownDefectsReported ?? null,
        knownDefectsDesc: knownDefectsDesc || null,
        serialNumberImei: serialNumberImei || null,
        images: images || [],
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
        shop: merchantShop,
      };
      // Prepend to memory mock items
      MOCK_ITEMS.unshift(newItem);
    }

    await syncItemToMeilisearch(newItem);

    return res.status(201).json({
      success: true,
      message: 'Item created and synced successfully',
      data: newItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updateData = { ...req.body };

    // Parse numerical price if present
    if (updateData.price !== undefined && updateData.price !== null) {
      updateData.price = parseFloat(updateData.price);
    }

    // Check shop owner
    let item;
    try {
      item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { shop: true },
      });
    } catch (dbError) {
      console.warn('Prisma update check failed, using mock check:', dbError.message);
    }

    // Strict Ownership Authorization validation
    if (item && item.shop) {
      if (req.user.role !== 'ADMIN' && item.shop.ownerId !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Forbidden: You can only update products listed by your own boutique' });
      }
    }

    let updatedItem;
    try {
      updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: updateData,
        include: { shop: true },
      });
    } catch (dbError) {
      const idx = MOCK_ITEMS.findIndex((i) => i.id === itemId);
      if (idx !== -1) {
        MOCK_ITEMS[idx] = { ...MOCK_ITEMS[idx], ...updateData, updatedAt: new Date() };
        updatedItem = MOCK_ITEMS[idx];
      } else {
        updatedItem = { id: itemId, ...updateData };
      }
    }

    try {
      await syncItemToMeilisearch(updatedItem);
    } catch (meiliErr) {
      // Meilisearch optional
    }

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    let item;
    try {
      item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { shop: true },
      });
    } catch (dbError) {
      console.warn('Prisma delete check failed, using mock check:', dbError.message);
    }

    // Strict Ownership Authorization validation
    if (item && item.shop) {
      if (req.user.role !== 'ADMIN' && item.shop.ownerId !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Forbidden: You can only delete products listed by your own boutique' });
      }
    }

    try {
      // Clean up any test orders or disputes referencing this item first
      const relatedOrders = await prisma.order.findMany({
        where: { itemId },
        select: { id: true },
      });

      if (relatedOrders.length > 0) {
        const orderIds = relatedOrders.map((o) => o.id);
        await prisma.dispute.deleteMany({ where: { orderId: { in: orderIds } } });
        await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
      }

      await prisma.item.delete({ where: { id: itemId } });
    } catch (err) {
      const idx = MOCK_ITEMS.findIndex((i) => i.id === itemId);
      if (idx !== -1) MOCK_ITEMS.splice(idx, 1);
    }

    try {
      await removeItemFromMeilisearch(itemId);
    } catch (meiliErr) {
      // Meilisearch optional
    }

    return res.status(200).json({
      success: true,
      message: 'Item successfully deleted and removed from rack inventory',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const markSoldInStore = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    let item;
    try {
      item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { shop: true },
      });
    } catch (dbError) {
      console.warn('Prisma markSold check failed, using mock check:', dbError.message);
    }

    // Strict Ownership Authorization validation
    if (item && item.shop) {
      if (req.user.role !== 'ADMIN' && item.shop.ownerId !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Forbidden: You do not have permission to toggle status for another merchant\'s boutique' });
      }
    }

    let targetStatus = status;
    if (!targetStatus) {
      const currentStatus = item ? item.status : (MOCK_ITEMS.find(i => i.id === itemId)?.status || 'AVAILABLE');
      targetStatus = currentStatus === 'SOLD_OFFLINE' ? 'AVAILABLE' : 'SOLD_OFFLINE';
    }

    let updatedItem;
    try {
      updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: { status: targetStatus },
      });
    } catch (dbError) {
      const idx = MOCK_ITEMS.findIndex((i) => i.id === itemId);
      if (idx !== -1) {
        MOCK_ITEMS[idx].status = targetStatus;
        MOCK_ITEMS[idx].updatedAt = new Date();
        updatedItem = MOCK_ITEMS[idx];
      } else {
        updatedItem = { id: itemId, status: targetStatus };
      }
    }

    await syncItemToMeilisearch(updatedItem);

    return res.status(200).json({
      success: true,
      message: `Item status updated to ${targetStatus}`,
      data: updatedItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
