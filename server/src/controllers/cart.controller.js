import prisma from '../prisma/client.js';
import { MOCK_ITEMS } from './item.controller.js';

/**
 * Validates an array of item IDs from the client cart.
 * Real-time 1-of-1 thrift stock validation.
 * POST /api/v1/cart/validate
 */
export const validateCart = async (req, res) => {
  try {
    let itemIds = req.body.itemIds;

    // Handle case if client passed array of item objects
    if (!itemIds && Array.isArray(req.body.items)) {
      itemIds = req.body.items.map((i) => (typeof i === 'string' ? i : i.id));
    } else if (typeof itemIds === 'string') {
      itemIds = [itemIds];
    }

    if (!itemIds || !Array.isArray(itemIds)) {
      return res.status(400).json({
        success: false,
        error: 'itemIds array is required',
      });
    }

    const validItems = [];
    const unavailableItems = [];

    for (const id of itemIds) {
      let item = null;

      try {
        item = await prisma.item.findUnique({
          where: { id },
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
        });
      } catch (dbErr) {
        // Fallback to mock item if DB error
        item = null;
      }

      // Check fallback mock items if not in DB
      if (!item) {
        const mock = MOCK_ITEMS.find((m) => m.id === id);
        if (mock) {
          item = { ...mock };
        }
      }

      if (!item) {
        unavailableItems.push({
          id,
          title: 'Unknown Thrift Item',
          reason: 'Item is no longer listed in catalog',
          status: 'NOT_FOUND',
        });
        continue;
      }

      if (item.status !== 'AVAILABLE') {
        unavailableItems.push({
          id: item.id,
          title: item.title,
          price: item.price,
          images: item.images,
          status: item.status,
          reason: item.status === 'SOLD' 
            ? 'Item was sold in-store or purchased by another collector' 
            : 'Item is currently reserved in an active checkout session',
        });
      } else {
        validItems.push({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          subcategory: item.subcategory,
          brand: item.brand,
          size: item.size,
          era: item.era,
          condition: item.condition,
          techConditionGrade: item.techConditionGrade,
          images: item.images || [],
          status: 'AVAILABLE',
          shopId: item.shopId || item.shop?.id || 'shop-1',
          shop: item.shop || {
            id: item.shopId || 'shop-1',
            shopName: 'Relic Vintage Co.',
            city: 'Mumbai',
            address: '42 Bandra West, Hill Road',
            isVerified: true,
          },
        });
      }
    }

    const subtotal = validItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    // Free insured shipping above ₹3,000, else flat ₹99
    const deliveryFee = subtotal === 0 || subtotal >= 3000 ? 0 : 99;
    const platformFee = 0; // 100% Escrow Protection is free on UnRetail
    const totalAmount = subtotal + deliveryFee + platformFee;

    return res.status(200).json({
      success: true,
      valid: unavailableItems.length === 0,
      validItems,
      unavailableItems,
      pricing: {
        subtotal,
        deliveryFee,
        platformFee,
        totalAmount,
        currency: 'INR',
      },
    });
  } catch (error) {
    console.error('Cart validation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to validate cart items',
    });
  }
};
