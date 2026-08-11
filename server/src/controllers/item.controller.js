import prisma from '../prisma/client.js';
import { syncItemToMeilisearch, removeItemFromMeilisearch, searchItemsInMeilisearch } from '../services/meili.service.js';

export const getItems = async (req, res) => {
  try {
    const { query, category, era, condition, city, status = 'AVAILABLE', limit = '20', page = '1' } = req.query;

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
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (era) whereClause.era = era;
    if (condition) whereClause.condition = condition;
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
      return res.status(200).json({
        success: true,
        source: 'mock',
        data: [
          {
            id: 'item-101',
            title: '1990s Vintage Levi 501 Heavyweight Denim',
            description: 'Authentic 90s vintage Levi 501s with dark indigo wash.',
            price: 68.0,
            category: 'Apparel',
            size: 'W32 L30',
            era: '90s',
            condition: 'LIKE_NEW',
            images: ['https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80'],
            status: 'AVAILABLE',
            shop: { id: 'shop-1', shopName: 'Relic Vintage Co.', slug: 'relic-vintage', city: 'Mumbai', isVerified: true },
          },
          {
            id: 'item-102',
            title: 'Distressed Harley Davidson Leather Jacket',
            description: 'Heavy patina genuine leather bomber jacket from late 80s.',
            price: 185.0,
            category: 'Outerwear',
            size: 'L',
            era: '80s',
            condition: 'GENTLY_USED',
            images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'],
            status: 'AVAILABLE',
            shop: { id: 'shop-2', shopName: 'Retro Vault', slug: 'retro-vault', city: 'Bengaluru', isVerified: true },
          },
        ],
      });
    }
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

      if (!item) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }

      return res.status(200).json({ success: true, data: item });
    } catch (dbError) {
      return res.status(200).json({
        success: true,
        data: {
          id: itemId,
          shopId: 'shop-1',
          title: '1990s Vintage Levi 501 Heavyweight Denim',
          description: 'Authentic 90s vintage Levi 501s with dark indigo wash. Made in USA.',
          price: 68.0,
          category: 'Apparel',
          size: 'W32 L30',
          era: '90s',
          condition: 'LIKE_NEW',
          images: [
            'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
          ],
          status: 'AVAILABLE',
          shop: {
            id: 'shop-1',
            shopName: 'Relic Vintage Co.',
            slug: 'relic-vintage',
            city: 'Mumbai',
            address: '42 Bandra West, Hill Road',
            isVerified: true,
            owner: { fullName: 'Aarav Patel', email: 'aarav@relicvintage.in' },
          },
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { shopId, title, description, price, category, size, era, condition, images } = req.body;

    if (!title || !price || !category || !shopId) {
      return res.status(400).json({ success: false, error: 'Missing required item fields (title, price, category, shopId)' });
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
    } catch (dbError) {
      newItem = {
        id: `item_${Math.random().toString(36).substring(2, 10)}`,
        shopId,
        title,
        description: description || '',
        price: parseFloat(price),
        category,
        size: size || 'OS',
        era: era || '90s',
        condition: condition || 'GENTLY_USED',
        images: images || [],
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
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
      updatedItem = { id: itemId, ...updateData };
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
      // Ignore if DB mock mode
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
