import prisma from '../prisma/client.js';
import { syncItemToMeilisearch, removeItemFromMeilisearch, searchItemsInMeilisearch } from '../services/meili.service.js';

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

    // Try Meilisearch first if text query is provided
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
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      });
    } catch (dbError) {
      console.error('Database getItems error:', dbError.message);
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: pageNum,
          limit: limitNum,
          totalPages: 0,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

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

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('getItemById error:', error);
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
    if (
      category === 'Tech & Retro Electronics' ||
      category === 'Tech & Electronics' ||
      category?.toLowerCase()?.includes('tech') ||
      category?.toLowerCase()?.includes('electronics')
    ) {
      const missingTechFields = [];
      if (!techConditionGrade) missingTechFields.push('Functional Condition Grade');
      if (!serialNumberImei || serialNumberImei.trim() === '')
        missingTechFields.push('Serial Number / IMEI (Private)');
      if (powerOnStatus === undefined || powerOnStatus === null) missingTechFields.push('Power-on status check');
      if (screenSensorClarity === undefined || screenSensorClarity === null)
        missingTechFields.push('Screen/Sensor clarity check');
      if (portChargingTested === undefined || portChargingTested === null)
        missingTechFields.push('Port/Charging circuit check');

      if (missingTechFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required tech verification attributes: ${missingTechFields.join(', ')}`,
          missingFields: missingTechFields,
        });
      }
    }

    // Check Merchant Approval Gating
    if (req.user?.role !== 'ADMIN') {
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (currentUser && currentUser.merchantStatus === 'REJECTED') {
        return res.status(403).json({
          success: false,
          error: `Your merchant application was rejected (${currentUser.rejectionReason || 'Please resubmit KYC'}). Please update your verification documents.`,
          merchantStatus: currentUser.merchantStatus,
        });
      }
    }

    // Dynamic Shop Linking based on logged-in user
    let merchantShop = await prisma.shop.findFirst({
      where: { ownerId: req.user.id },
    });

    if (!merchantShop) {
      const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });
      const shopName =
        currentUser?.shopName || req.user.shopName || `${currentUser?.fullName || req.user.fullName || 'Vintage'} Boutique`;
      const slug = `${shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;
      merchantShop = await prisma.shop.create({
        data: {
          ownerId: req.user.id,
          shopName,
          slug,
          city: currentUser?.city || req.user.city || 'Mumbai',
          address: currentUser?.address || req.user.address || '42 Bandra West, Hill Road',
          isVerified: true,
        },
      });
    }

    const newItem = await prisma.item.create({
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

    try {
      await syncItemToMeilisearch(newItem);
    } catch (meiliErr) {
      // Meilisearch optional
    }

    return res.status(201).json({
      success: true,
      message: 'Item created and synced successfully',
      data: newItem,
    });
  } catch (error) {
    console.error('createItem error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updateData = { ...req.body };

    if (updateData.price !== undefined && updateData.price !== null) {
      updateData.price = parseFloat(updateData.price);
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { shop: true },
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Strict Ownership Authorization validation
    if (item.shop && req.user.role !== 'ADMIN' && item.shop.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You can only update products listed by your own boutique',
      });
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: updateData,
      include: { shop: true },
    });

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
    console.error('updateItem error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { shop: true },
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Strict Ownership Authorization validation
    if (item.shop && req.user.role !== 'ADMIN' && item.shop.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You can only delete products listed by your own boutique',
      });
    }

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
    console.error('deleteItem error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const markSoldInStore = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { shop: true },
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Strict Ownership Authorization validation
    if (item.shop && req.user.role !== 'ADMIN' && item.shop.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You do not have permission to toggle status for another merchant's boutique",
      });
    }

    let targetStatus = status;
    if (!targetStatus) {
      targetStatus = item.status === 'SOLD_OFFLINE' ? 'AVAILABLE' : 'SOLD_OFFLINE';
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: { status: targetStatus },
    });

    try {
      await syncItemToMeilisearch(updatedItem);
    } catch (meiliErr) {
      // Meilisearch optional
    }

    return res.status(200).json({
      success: true,
      message: `Item status updated to ${targetStatus}`,
      data: updatedItem,
    });
  } catch (error) {
    console.error('markSoldInStore error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
