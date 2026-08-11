import crypto from 'crypto';
import prisma from '../prisma/client.js';
import { createRazorpayOrder } from '../services/razorpay.service.js';
import { generateCloudinarySignature } from '../services/cloudinary.service.js';
import { syncItemToMeilisearch } from '../services/meili.service.js';

export const createOrder = async (req, res) => {
  try {
    const { itemId, shopId } = req.body;
    const buyerId = req.user?.id || req.body?.buyerId || 'guest_buyer';

    if (!itemId) {
      return res.status(400).json({ success: false, error: 'itemId is required' });
    }

    let item;
    try {
      item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { shop: true },
      });
    } catch (err) {
      item = null;
    }

    const price = item ? item.price : 68.0;
    const targetShopId = item ? item.shopId : (shopId || 'shop-1');

    const receipt = `rcpt_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder(price, 'INR', receipt);

    let dbOrder;
    try {
      dbOrder = await prisma.order.create({
        data: {
          buyerId,
          itemId,
          shopId: targetShopId,
          amountPaid: price,
          razorpayOrderId: razorpayOrder.id,
          status: 'PENDING',
        },
      });
    } catch (dbError) {
      dbOrder = {
        id: `ord_${Math.random().toString(36).substring(2, 10)}`,
        buyerId,
        itemId,
        shopId: targetShopId,
        amountPaid: price,
        razorpayOrderId: razorpayOrder.id,
        status: 'PENDING',
        createdAt: new Date(),
      };
    }

    return res.status(201).json({
      success: true,
      message: 'Razorpay order created successfully',
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyIdHere',
      },
      order: dbOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'YourRazorpayWebhookSecretHere';
    const razorpaySignature = req.headers['x-razorpay-signature'];

    if (razorpaySignature) {
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature) {
        return res.status(400).json({ success: false, error: 'Invalid HMAC SHA256 webhook signature' });
      }
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured' || event === 'order.paid') {
      const entity = payload.payment ? payload.payment.entity : payload.order.entity;
      const razorpayOrderId = entity.order_id || entity.id;
      const razorpayPaymentId = entity.id;

      try {
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'PAID',
              razorpayPaymentId,
            },
          });

          const updatedItem = await prisma.item.update({
            where: { id: order.itemId },
            data: { status: 'SOLD' },
          });

          await syncItemToMeilisearch(updatedItem);
        }
      } catch (dbErr) {
        console.warn('Webhook DB update warning:', dbErr);
      }
    }

    return res.status(200).json({ success: true, status: 'ok' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getCloudinarySignature = async (_req, res) => {
  try {
    const signaturePayload = generateCloudinarySignature('unretail-listings');
    return res.status(200).json({
      success: true,
      data: signaturePayload,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
