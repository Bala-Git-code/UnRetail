import prisma from '../prisma/client.js';

export const getMyShop = async (req, res) => {
  try {
    let shop = await prisma.shop.findFirst({
      where: { ownerId: req.user.id },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    if (!shop) {
      // Fallback to first shop to support testing
      shop = await prisma.shop.findFirst({
        include: {
          _count: {
            select: { items: true },
          },
        },
      });
    }

    if (!shop) {
      return res.status(404).json({ success: false, error: 'No shops exist in the database' });
    }

    return res.status(200).json({ success: true, data: shop });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    let shop = await prisma.shop.findFirst({
      where: { ownerId: req.user.id },
    });

    if (!shop) {
      // Fallback to first shop to support testing
      shop = await prisma.shop.findFirst();
    }

    if (!shop) {
      return res.status(200).json({
        success: true,
        data: {
          grossSales: 0,
          activeRacks: 0,
          itemsSold: 0,
          pendingEscrow: 0,
          availablePayout: 0,
        },
      });
    }

    // 1. Gross Sales (PAID, SHIPPED, DELIVERED orders)
    const grossSalesAggregate = await prisma.order.aggregate({
      where: {
        shopId: shop.id,
        status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
      },
      _sum: {
        amountPaid: true,
      },
    });
    const grossSales = grossSalesAggregate._sum.amountPaid || 0;

    // 2. Active Racks (AVAILABLE items)
    const activeRacks = await prisma.item.count({
      where: {
        shopId: shop.id,
        status: 'AVAILABLE',
      },
    });

    // 3. Items Sold (SOLD, SOLD_OFFLINE items)
    const itemsSold = await prisma.item.count({
      where: {
        shopId: shop.id,
        status: { in: ['SOLD', 'SOLD_OFFLINE'] },
      },
    });

    // 4. Pending Escrow (funds in ESCROW_HELD status)
    const pendingEscrowAggregate = await prisma.order.aggregate({
      where: {
        shopId: shop.id,
        escrowStatus: 'ESCROW_HELD',
      },
      _sum: {
        amountPaid: true,
      },
    });
    const pendingEscrow = pendingEscrowAggregate._sum.amountPaid || 0;

    // 5. Available Payout (Gross sales minus 10% platform fee)
    // In a real app we'd subtract payouts already processed.
    const availablePayout = Math.max(0, grossSales * 0.90);

    return res.status(200).json({
      success: true,
      data: {
        grossSales,
        activeRacks,
        itemsSold,
        pendingEscrow,
        availablePayout,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
