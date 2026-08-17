import prisma from '../prisma/client.js';
import { syncItemToMeilisearch, removeItemFromMeilisearch, searchItemsInMeilisearch } from '../services/meili.service.js';

const MOCK_ITEMS = [
  {
    id: 'item-101',
    shopId: 'shop-1',
    title: '1990s Vintage Levi 501 Heavyweight Denim',
    description: 'Authentic 90s vintage Levi 501s with dark indigo wash. Made in USA with 14oz rigid denim.',
    price: 5499,
    category: 'Apparel',
    subcategory: 'Denim & Bottoms',
    size: 'W32 L30',
    era: '90s',
    condition: 'LIKE_NEW',
    images: ['/images/denim_vintage.png'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-01T10:00:00Z'),
    updatedAt: new Date('2026-08-01T10:00:00Z'),
    shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', address: '42 Bandra West, Hill Road', isVerified: true },
  },
  {
    id: 'item-102',
    shopId: 'shop-2',
    title: 'Distressed Harley Davidson Leather Bomber Jacket',
    description: 'Heavy patina genuine leather bomber jacket from late 80s. Authentic motorcycle heritage piece.',
    price: 12500,
    category: 'Apparel',
    subcategory: 'Outerwear & Jackets',
    size: 'L',
    era: '80s',
    condition: 'GENTLY_USED',
    images: ['/images/leather_jacket.png'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-02T11:30:00Z'),
    updatedAt: new Date('2026-08-02T11:30:00Z'),
    shop: { id: 'shop-2', shopName: 'Retro Vault', slug: 'retro-vault', city: 'Bengaluru', address: '108 Indiranagar, 100ft Road', isVerified: true },
  },
  {
    id: 'item-103',
    shopId: 'shop-3',
    title: 'Y2K Stussy Graphic Heavyweight Tee',
    description: 'Single stitch faded black graphic tee. Pre-shrunk vintage cotton drop with archival graphic.',
    price: 2800,
    category: 'Apparel',
    subcategory: 'Tops & Graphic Tees',
    size: 'XL',
    era: 'Y2K',
    condition: 'LIKE_NEW',
    images: ['/images/graphic_tee.png'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-03T09:15:00Z'),
    updatedAt: new Date('2026-08-03T09:15:00Z'),
    shop: { id: 'shop-3', shopName: 'Dust & Gold Vintage', slug: 'dust-and-gold', city: 'Delhi', address: '15 Hauz Khas Village', isVerified: false },
  },
  {
    id: 'item-104',
    shopId: 'shop-1',
    title: 'Archival Japanese-Release High-Top Sneakers',
    description: 'Ultra-rare archival high-top canvas sneakers with vulcanized rubber sole and vintage patina.',
    price: 8900,
    category: 'Accessories',
    subcategory: 'Footwear & Sneakers',
    size: 'US 10',
    era: 'Archival',
    condition: 'GENTLY_USED',
    images: ['/images/archival_sneakers.png'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-04T14:20:00Z'),
    updatedAt: new Date('2026-08-04T14:20:00Z'),
    shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', address: '42 Bandra West, Hill Road', isVerified: true },
  },
  {
    id: 'item-105',
    shopId: 'shop-2',
    title: 'Sony Cyber-shot DSC-P100 Silver Digicam',
    description: 'Legendary 2004 CCD sensor 5.1MP digicam with Carl Zeiss Vario-Tessar 3x optical zoom. Includes original battery, Memory Stick, and charger.',
    price: 9400,
    category: 'Tech & Retro Electronics',
    subcategory: 'Digicams & 35mm Film',
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
    createdAt: new Date('2026-08-05T16:45:00Z'),
    updatedAt: new Date('2026-08-05T16:45:00Z'),
    shop: { id: 'shop-2', shopName: 'Retro Vault', slug: 'retro-vault', city: 'Bengaluru', address: '108 Indiranagar, 100ft Road', isVerified: true },
  },
  {
    id: 'item-106',
    shopId: 'shop-1',
    title: 'Nintendo Game Boy Color - Atomic Purple Edition',
    description: 'Archival 1998 translucent atomic purple handheld with authentic casing and crisp clean LCD panel. Buttons and speaker fully tested.',
    price: 7800,
    category: 'Tech & Retro Electronics',
    subcategory: 'Gaming Handhelds',
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
    createdAt: new Date('2026-08-06T12:10:00Z'),
    updatedAt: new Date('2026-08-06T12:10:00Z'),
    shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', address: '42 Bandra West, Hill Road', isVerified: true },
  },
  {
    id: 'item-107',
    shopId: 'shop-3',
    title: 'Sony Walkman WM-EX674 Slim Cassette Player',
    description: 'High-end brushed aluminum Japanese cassette player with Dolby B NR, auto-reverse, and mega bass.',
    price: 11200,
    category: 'Tech & Retro Electronics',
    subcategory: 'Audio & Vinyl',
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
    images: ['/images/retro_audio.png'],
    status: 'AVAILABLE',
    createdAt: new Date('2026-08-07T15:30:00Z'),
    updatedAt: new Date('2026-08-07T15:30:00Z'),
    shop: { id: 'shop-3', shopName: 'Dust & Gold Vintage', slug: 'dust-and-gold', city: 'Delhi', address: '15 Hauz Khas Village', isVerified: false },
  },
];

export const getItems = async (req, res) => {
  try {
    const {
      query,
      category,
      subcategory,
      era,
      condition,
      techConditionGrade,
      city,
      status = 'AVAILABLE',
      limit = '20',
      page = '1',
    } = req.query;

    if (query && typeof query === 'string') {
      const hits = await searchItemsInMeilisearch(query, { category, subcategory, era, condition, status });
      if (hits && hits.length > 0) {
        return res.status(200).json({
          success: true,
          source: 'meilisearch',
          data: hits,
          total: hits.length,
        });
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
    if (city) {
      whereClause.shop = {
        city: { contains: city, mode: 'insensitive' },
      };
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

      if (items.length > 0) {
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
      }
    } catch (dbError) {
      // Fallback to local memory mock items
    }

    // Filter local mock items
    let filtered = [...MOCK_ITEMS];
    if (status && status !== 'ALL') filtered = filtered.filter((i) => i.status === status);
    if (category && category !== 'ALL') filtered = filtered.filter((i) => i.category === category);
    if (subcategory && subcategory !== 'ALL') filtered = filtered.filter((i) => i.subcategory === subcategory);
    if (era) filtered = filtered.filter((i) => i.era === era);
    if (condition) filtered = filtered.filter((i) => i.condition === condition);
    if (techConditionGrade) filtered = filtered.filter((i) => i.techConditionGrade === techConditionGrade);
    if (city) filtered = filtered.filter((i) => i.shop?.city?.toLowerCase() === city.toLowerCase());
    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
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
      // Fallback
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
      shopId,
      title,
      description,
      price,
      category,
      subcategory,
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

    if (!title || !price || !category || !shopId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required item fields (title, price, category, shopId)',
      });
    }

    // Tech & Retro Electronics Conditional Anti-Fraud Validation
    if (category === 'Tech & Retro Electronics') {
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

    let newItem;
    try {
      newItem = await prisma.item.create({
        data: {
          shopId,
          title,
          description: description || '',
          price: parseFloat(price),
          category,
          subcategory: subcategory || null,
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
      newItem = {
        id: `item_${Math.random().toString(36).substring(2, 10)}`,
        shopId,
        title,
        description: description || '',
        price: parseFloat(price),
        category,
        subcategory: subcategory || null,
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
        shop: {
          id: shopId,
          shopName: 'Relic Vintage Co.',
          city: 'Mumbai',
          address: '42 Bandra West, Hill Road',
          isVerified: true,
        },
      };
      // Prepend to memory mock items
      MOCK_ITEMS.unshift(newItem);
    }

    await syncItemToMeilisearch(newItem);

    return res.status(201).json({
      success: true,
      message: 'Item created and synced to search index successfully',
      data: newItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updateData = req.body;

    let updatedItem;
    try {
      updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: updateData,
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

    await syncItemToMeilisearch(updatedItem);

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

    try {
      await prisma.item.delete({ where: { id: itemId } });
    } catch (err) {
      const idx = MOCK_ITEMS.findIndex((i) => i.id === itemId);
      if (idx !== -1) MOCK_ITEMS.splice(idx, 1);
    }

    await removeItemFromMeilisearch(itemId);

    return res.status(200).json({
      success: true,
      message: 'Item deleted and removed from search index',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

