import prisma from '../prisma/client.js';
import { createRazorpayOrder } from '../services/razorpay.service.js';

/**
 * Helper to ensure a valid User record exists in DB for foreign key relations
 */
async function resolveOrCreateBuyer(tx, buyerId, userObj) {
  if (buyerId && buyerId !== 'guest_buyer') {
    const existing = await tx.user.findUnique({ where: { id: buyerId } });
    if (existing) return existing.id;

    // Create record for this buyer ID
    const created = await tx.user.create({
      data: {
        id: buyerId,
        email: userObj?.email || `user_${buyerId.substring(0, 8)}@unretail.in`,
        fullName: userObj?.fullName || 'UnRetail Shopper',
        role: 'CUSTOMER',
      },
    });
    return created.id;
  }

  // Find or create default guest user
  let guestUser = await tx.user.findFirst({ where: { email: 'guest@unretail.in' } });
  if (!guestUser) {
    guestUser = await tx.user.create({
      data: {
        email: 'guest@unretail.in',
        fullName: 'UnRetail Guest Shopper',
        role: 'CUSTOMER',
      },
    });
  }
  return guestUser.id;
}

export const createOrderIntent = async (req, res) => {
  try {
    const { itemId, shopId } = req.body;
    const requestedBuyerId = req.user?.id || req.body?.buyerId || 'guest_buyer';

    if (!itemId) {
      return res.status(400).json({ success: false, error: 'itemId is required' });
    }

    // Run inside prisma transaction to ensure atomic stock checking
    let result;
    try {
      result = await prisma.$transaction(async (tx) => {
        const item = await tx.item.findUnique({
          where: { id: itemId },
          include: { shop: true },
        });

        if (!item) {
          throw new Error('Item not found in catalog');
        }

        if (item.status !== 'AVAILABLE') {
          throw new Error('Item is no longer available for purchase');
        }

        const price = item.price;
        const targetShopId = item.shopId || shopId || 'shop-1';
        const finalBuyerId = await resolveOrCreateBuyer(tx, requestedBuyerId, req.user);

        // Mark the item status as PENDING to hold stock during payment session
        await tx.item.update({
          where: { id: itemId },
          data: { status: 'PENDING' },
        });

        const receipt = `rcpt_${Date.now()}`;
        const razorpayOrder = await createRazorpayOrder(price, 'INR', receipt);

        const dbOrder = await tx.order.create({
          data: {
            buyerId: finalBuyerId,
            itemId,
            shopId: targetShopId,
            amountPaid: price,
            razorpayOrderId: razorpayOrder.id,
            status: 'PENDING',
            escrowStatus: 'ACTIVE',
          },
        });

        return { razorpayOrder, dbOrder };
      });
    } catch (txErr) {
      if (txErr.message.includes('not found') || txErr.message.includes('no longer available')) {
        return res.status(400).json({ success: false, error: txErr.message });
      }
      throw txErr;
    }

    return res.status(201).json({
      success: true,
      message: 'Order intent created and item locked',
      razorpayOrder: {
        id: result.razorpayOrder.id,
        amount: result.razorpayOrder.amount,
        currency: result.razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyIdHere',
      },
      order: result.dbOrder,
    });
  } catch (error) {
    console.error('Order creation transaction failed:', error.message);
    return res.status(400).json({ success: false, error: error.message || 'Failed to create order' });
  }
};

export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { buyerId: req.user.id },
      include: {
        item: true,
        shop: {
          select: {
            shopName: true,
            city: true,
            address: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getMerchantOrders = async (req, res) => {
  try {
    let shop = await prisma.shop.findFirst({
      where: { ownerId: req.user.id },
    });

    if (!shop) {
      shop = await prisma.shop.findFirst();
    }

    if (!shop) {
      return res.status(200).json({ success: true, data: [] });
    }

    const orders = await prisma.order.findMany({
      where: { shopId: shop.id },
      include: {
        item: true,
        buyer: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingCode, carrierName } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { shop: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Verify user owns the shop, or is MERCHANT, or is ADMIN
    const isOwner = order.shop?.ownerId === req.user.id;
    const isMerchant = req.user.role === 'MERCHANT';
    const isAdmin = req.user.role === 'ADMIN';
    if (!isOwner && !isMerchant && !isAdmin) {
      return res.status(403).json({ success: false, error: "Forbidden: You do not have permission to manage this shop's orders" });
    }

    // Validate state transitions
    // Transitions should go: PENDING -> PAID -> SHIPPED -> DELIVERED
    if (status === 'SHIPPED') {
      if (order.status !== 'PAID') {
        return res.status(400).json({ success: false, error: 'Order must be PAID before marking as SHIPPED' });
      }
      if (!trackingCode || !carrierName) {
        return res.status(400).json({ success: false, error: 'Tracking code and carrier name are required' });
      }
    } else if (status === 'DELIVERED') {
      if (order.status !== 'SHIPPED') {
        return res.status(400).json({ success: false, error: 'Order must be SHIPPED before marking as DELIVERED' });
      }
    }

    const updateData = { status };

    if (status === 'SHIPPED') {
      updateData.trackingCode = trackingCode;
      updateData.carrierName = carrierName;
    }

    if (status === 'DELIVERED') {
      updateData.escrowStatus = 'ESCROW_HELD';
      // Set inspection window countdown to 48 hours from now
      updateData.escrowReleaseDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { item: true },
    });

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    let order = null;
    try {
      order = await prisma.order.findFirst({
        where: {
          OR: [
            { id: orderId },
            { razorpayOrderId: orderId },
            { razorpayPaymentId: orderId },
          ],
        },
        include: {
          item: true,
          shop: {
            select: {
              id: true,
              shopName: true,
              city: true,
              address: true,
              isVerified: true,
            },
          },
          buyer: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });
    } catch (err) {
      order = null;
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
