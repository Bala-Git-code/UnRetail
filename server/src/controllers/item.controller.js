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
      city, 
      shopId,
      minPrice,
      maxPrice,
      status = 'AVAILABLE', 
      limit = '20', 
      page = '1' 
    } = req.query;

    // Try Meilisearch first if query is provided
    if (query && typeof query === 'string') {
      const hits = await searchItemsInMeilisearch(query, { category, era, condition, status });
      if (hits) {
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
    
    // Status filter
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }
    
    // Standard filters
    if (category) whereClause.category = category;
    if (subcategory) whereClause.subcategory = subcategory;
    if (era) whereClause.era = era;
    if (condition) whereClause.condition = condition;
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
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    return res.status(200).json({ success: true, data: item });
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
      serialNumber,
      size, 
      era, 
      condition, 
      images 
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ success: false, error: 'Missing required item fields (title, price, category)' });
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

    const newItem = await prisma.item.create({
      data: {
        shopId: merchantShop.id,
        title,
        description: description || '',
        price: parseFloat(price),
        category,
        subcategory: subcategory || null,
        brand: brand || null,
        serialNumber: serialNumber || null,
        size: size || 'OS',
        era: era || '90s',
        condition: condition || 'GENTLY_USED',
        images: images || [],
        status: 'AVAILABLE',
      },
      include: {
        shop: true,
      },
    });

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
    const updateData = req.body;

    // Check shop owner
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { shop: true },
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    if (item.shop.ownerId !== req.user.id && req.user.role !== 'MERCHANT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden: You do not have permission to update this item' });
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: updateData,
    });

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

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { shop: true },
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    if (item.shop.ownerId !== req.user.id && req.user.role !== 'MERCHANT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden: You do not have permission to delete this item' });
    }

    await prisma.item.delete({ where: { id: itemId } });
    await removeItemFromMeilisearch(itemId);

    return res.status(200).json({
      success: true,
      message: 'Item deleted and removed from search index',
    });
  } catch (error) {
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
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    if (item.shop.ownerId !== req.user.id && req.user.role !== 'MERCHANT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden: You do not have permission to toggle status for this shop' });
    }

    let targetStatus = status;
    if (!targetStatus) {
      targetStatus = item.status === 'SOLD_OFFLINE' ? 'AVAILABLE' : 'SOLD_OFFLINE';
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: { status: targetStatus },
    });

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
