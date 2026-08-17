import prisma from '../prisma/client.js';

export const createDispute = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const customerId = req.user.id;

    if (!orderId || !reason) {
      return res.status(400).json({ success: false, error: 'orderId and reason are required' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Verify ownership
    if (order.buyerId !== customerId) {
      return res.status(403).json({ success: false, error: 'Forbidden: You did not purchase this order' });
    }

    // Verify 48-hour inspection window
    if (order.escrowStatus !== 'ESCROW_HELD') {
      return res.status(400).json({ success: false, error: 'Dispute can only be raised after order is DELIVERED and escrow is HELD' });
    }

    if (order.escrowReleaseDate && new Date() > new Date(order.escrowReleaseDate)) {
      return res.status(400).json({ success: false, error: 'Dispute inspection window (48 hours) has expired' });
    }

    // Create dispute and update order status inside a transaction
    const dispute = await prisma.$transaction(async (tx) => {
      const newDispute = await tx.dispute.create({
        data: {
          orderId,
          customerId,
          reason,
          status: 'OPEN',
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          escrowStatus: 'DISPUTED',
        },
      });

      return newDispute;
    });

    return res.status(201).json({
      success: true,
      message: 'Dispute submitted successfully and escrow funds locked',
      data: dispute,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getDisputes = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let disputes;

    if (role === 'ADMIN') {
      // Admins see all disputes
      disputes = await prisma.dispute.findMany({
        include: {
          order: {
            include: {
              item: true,
              shop: true,
            },
          },
          customer: {
            select: { fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (role === 'MERCHANT') {
      // Merchants see disputes for their shop
      const shop = await prisma.shop.findFirst({
        where: { ownerId: userId },
      });

      if (!shop) {
        return res.status(200).json({ success: true, data: [] });
      }

      disputes = await prisma.dispute.findMany({
        where: {
          order: {
            shopId: shop.id,
          },
        },
        include: {
          order: {
            include: { item: true },
          },
          customer: {
            select: { fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Customers see their own disputes
      disputes = await prisma.dispute.findMany({
        where: { customerId: userId },
        include: {
          order: {
            include: { item: true, shop: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return res.status(200).json({ success: true, data: disputes });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const resolveDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { resolution } = req.body; // 'REFUND_BUYER' or 'RELEASE_TO_MERCHANT'

    if (!['REFUND_BUYER', 'RELEASE_TO_MERCHANT'].includes(resolution)) {
      return res.status(400).json({ success: false, error: 'Invalid resolution choice. Must be REFUND_BUYER or RELEASE_TO_MERCHANT' });
    }

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { order: true },
    });

    if (!dispute) {
      return res.status(404).json({ success: false, error: 'Dispute not found' });
    }

    if (dispute.status !== 'OPEN') {
      return res.status(400).json({ success: false, error: 'Dispute is already resolved' });
    }

    const resolved = await prisma.$transaction(async (tx) => {
      const nextDisputeStatus = resolution === 'REFUND_BUYER' ? 'REFUNDED' : 'RESOLVED';
      const nextEscrowStatus = resolution === 'REFUND_BUYER' ? 'REFUNDED' : 'RELEASED';

      const updatedDispute = await tx.dispute.update({
        where: { id: disputeId },
        data: { status: nextDisputeStatus },
      });

      await tx.order.update({
        where: { id: dispute.orderId },
        data: { escrowStatus: nextEscrowStatus },
      });

      // If refunding, mark item status back to AVAILABLE
      if (resolution === 'REFUND_BUYER') {
        await tx.item.update({
          where: { id: dispute.order.itemId },
          data: { status: 'AVAILABLE' },
        });
      }

      return updatedDispute;
    });

    return res.status(200).json({
      success: true,
      message: `Dispute resolved with decision: ${resolution}`,
      data: resolved,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
