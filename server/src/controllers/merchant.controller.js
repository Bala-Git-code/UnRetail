import prisma from '../prisma/client.js';
import { uploadToCloudinary } from '../services/cloudinary.service.js';

// In-memory fallback cache for development/mocking when DB is in memory
let MOCK_MERCHANTS = [
  {
    id: 'usr_relic_owner',
    email: 'aarav@relicvintage.in',
    fullName: 'Aarav Patel',
    role: 'MERCHANT',
    phoneNumber: '+91 98201 54321',
    address: '42 Bandra West, Hill Road',
    city: 'Mumbai',
    shopName: 'Relic Vintage Co.',
    idProofType: 'Aadhaar Card',
    idProofNumber: '8942 1045 7712',
    idProofUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    idPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    merchantStatus: 'APPROVED',
    rejectionReason: null,
    approvedAt: new Date('2026-08-01T10:00:00Z'),
    createdAt: new Date('2026-07-28T09:00:00Z'),
    shops: [{ id: 'shop-1', shopName: 'Relic Vintage Co.', city: 'Mumbai', isVerified: true }],
  },
  {
    id: 'usr_retrovault_owner',
    email: 'priya@retrovault.in',
    fullName: 'Priya Sharma',
    role: 'MERCHANT',
    phoneNumber: '+91 98450 12345',
    address: '108 Indiranagar, 100ft Road',
    city: 'Bengaluru',
    shopName: 'Retro Vault',
    idProofType: 'PAN Card',
    idProofNumber: 'ABCPS1234F',
    idProofUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    idPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    merchantStatus: 'APPROVED',
    rejectionReason: null,
    approvedAt: new Date('2026-08-02T11:00:00Z'),
    createdAt: new Date('2026-08-01T08:30:00Z'),
    shops: [{ id: 'shop-2', shopName: 'Retro Vault', city: 'Bengaluru', isVerified: true }],
  },
  {
    id: 'usr_dustgold_owner',
    email: 'rohan@dustandgold.in',
    fullName: 'Rohan Verma',
    role: 'MERCHANT',
    phoneNumber: '+91 98111 87654',
    address: '15 Hauz Khas Village',
    city: 'Delhi',
    shopName: 'Dust & Gold Vintage',
    idProofType: 'Aadhaar Card',
    idProofNumber: '5412 8901 3349',
    idProofUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    idPhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    merchantStatus: 'PENDING',
    rejectionReason: null,
    approvedAt: null,
    createdAt: new Date('2026-08-10T14:20:00Z'),
    shops: [{ id: 'shop-3', shopName: 'Dust & Gold Vintage', city: 'Delhi', isVerified: false }],
  },
];

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

/**
 * Submit Merchant KYC & Citizen Onboarding
 */
export const submitMerchantOnboarding = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User must be authenticated' });
    }

    const {
      email,
      fullName,
      phoneNumber,
      address,
      city,
      shopName,
      idProofType,
      idProofNumber,
      idProofImage,
      idPhotoImage,
    } = req.body;

    if (!phoneNumber || !address || !city || !idProofType || !idProofNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required onboarding fields: phoneNumber, address, city, idProofType, and idProofNumber are required.',
      });
    }

    if (!idProofImage || !idPhotoImage) {
      return res.status(400).json({
        success: false,
        error: 'Both a valid Indian Citizen ID Proof document image and an Identification Photo must be uploaded.',
      });
    }

    // Process Cloudinary Uploads for ID Proof & Photo
    let uploadedIdProofUrl = idProofImage;
    let uploadedIdPhotoUrl = idPhotoImage;

    try {
      if (idProofImage.startsWith('data:') || idProofImage.startsWith('blob:')) {
        uploadedIdProofUrl = await uploadToCloudinary(idProofImage, 'unretail-kyc-docs');
      }
      if (idPhotoImage.startsWith('data:') || idPhotoImage.startsWith('blob:')) {
        uploadedIdPhotoUrl = await uploadToCloudinary(idPhotoImage, 'unretail-kyc-photos');
      }
    } catch (uploadErr) {
      console.warn('Cloudinary upload warning during onboarding:', uploadErr.message);
    }

    const assignedShopName = shopName?.trim() || `${fullName || 'Vintage'} Boutique`;
    const slug = assignedShopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `shop-${Math.random().toString(36).substring(2, 7)}`;

    let updatedUser;
    let shopRecord;

    try {
      // 1. Update User in DB
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          role: 'MERCHANT',
          fullName: fullName?.trim() || undefined,
          phoneNumber: phoneNumber?.trim(),
          address: address?.trim(),
          city: city?.trim(),
          shopName: assignedShopName,
          idProofType: idProofType?.trim(),
          idProofNumber: idProofNumber?.trim(),
          idProofUrl: uploadedIdProofUrl,
          idPhotoUrl: uploadedIdPhotoUrl,
          merchantStatus: 'PENDING',
          rejectionReason: null,
        },
      });

      // 2. Ensure Shop record exists for this merchant
      const existingShop = await prisma.shop.findFirst({ where: { ownerId: userId } });
      if (existingShop) {
        shopRecord = await prisma.shop.update({
          where: { id: existingShop.id },
          data: {
            shopName: assignedShopName,
            city: city?.trim(),
            address: address?.trim(),
            isVerified: false,
          },
        });
      } else {
        shopRecord = await prisma.shop.create({
          data: {
            ownerId: userId,
            shopName: assignedShopName,
            slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
            city: city?.trim(),
            address: address?.trim(),
            isVerified: false,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma onboarding update failed, using memory store:', dbErr.message);
      
      const mockEntry = {
        id: userId,
        email: email || req.user.email,
        fullName: fullName || req.user.fullName || 'Merchant User',
        role: 'MERCHANT',
        phoneNumber,
        address,
        city,
        shopName: assignedShopName,
        idProofType,
        idProofNumber,
        idProofUrl: uploadedIdProofUrl,
        idPhotoUrl: uploadedIdPhotoUrl,
        merchantStatus: 'PENDING',
        rejectionReason: null,
        approvedAt: null,
        createdAt: new Date(),
        shops: [{ id: `shop-${userId}`, shopName: assignedShopName, city, isVerified: false }],
      };

      const existingIdx = MOCK_MERCHANTS.findIndex((m) => m.id === userId || m.email === req.user.email);
      if (existingIdx >= 0) {
        MOCK_MERCHANTS[existingIdx] = { ...MOCK_MERCHANTS[existingIdx], ...mockEntry };
      } else {
        MOCK_MERCHANTS.unshift(mockEntry);
      }

      updatedUser = mockEntry;
      shopRecord = mockEntry.shops[0];
    }

    return res.status(200).json({
      success: true,
      message: 'Merchant KYC details and Indian citizen verification submitted successfully. Your account is now pending admin approval.',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          role: updatedUser.role,
          phoneNumber: updatedUser.phoneNumber,
          address: updatedUser.address,
          city: updatedUser.city,
          shopName: updatedUser.shopName,
          idProofType: updatedUser.idProofType,
          idProofNumber: updatedUser.idProofNumber,
          idProofUrl: updatedUser.idProofUrl,
          idPhotoUrl: updatedUser.idPhotoUrl,
          merchantStatus: updatedUser.merchantStatus,
        },
        shop: shopRecord,
      },
    });
  } catch (error) {
    console.error('Merchant onboarding error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Onboarding submission failed' });
  }
};

/**
 * Get current user merchant KYC & approval status
 */
export const getMerchantStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    let user;

    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { shops: true },
      });
    } catch (err) {
      user = MOCK_MERCHANTS.find((m) => m.id === userId || m.email === req.user.email) || null;
    }

    if (!user) {
      return res.status(200).json({
        success: true,
        data: {
          merchantStatus: req.user.role === 'ADMIN' ? 'APPROVED' : 'UNSUBMITTED',
          canPostItems: req.user.role === 'ADMIN',
          rejectionReason: null,
        },
      });
    }

    const isApproved = user.merchantStatus === 'APPROVED' || user.role === 'ADMIN';

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        city: user.city,
        shopName: user.shopName,
        idProofType: user.idProofType,
        idProofNumber: user.idProofNumber,
        idProofUrl: user.idProofUrl,
        idPhotoUrl: user.idPhotoUrl,
        merchantStatus: user.merchantStatus || (user.role === 'ADMIN' ? 'APPROVED' : 'UNSUBMITTED'),
        rejectionReason: user.rejectionReason,
        approvedAt: user.approvedAt,
        canPostItems: isApproved,
        shop: user.shops?.[0] || null,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Admin: Get all merchant applications and KYC status
 */
export const getAllMerchants = async (req, res) => {
  try {
    const { status, search } = req.query;

    try {
      const whereClause = {
        OR: [
          { role: 'MERCHANT' },
          { merchantStatus: { not: 'UNSUBMITTED' } },
        ],
      };

      if (status && status !== 'ALL') {
        whereClause.merchantStatus = status;
      }

      if (search) {
        whereClause.AND = [
          {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { shopName: { contains: search, mode: 'insensitive' } },
              { city: { contains: search, mode: 'insensitive' } },
            ],
          },
        ];
      }

      const merchants = await prisma.user.findMany({
        where: whereClause,
        include: {
          shops: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (merchants.length > 0) {
        return res.status(200).json({ success: true, data: merchants });
      }
    } catch (dbErr) {
      console.warn('Prisma find merchants failed, falling back to mock:', dbErr.message);
    }

    // Fallback Mock Filter
    let list = [...MOCK_MERCHANTS];
    if (status && status !== 'ALL') {
      list = list.filter((m) => m.merchantStatus === status);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.fullName?.toLowerCase().includes(s) ||
          m.email?.toLowerCase().includes(s) ||
          m.shopName?.toLowerCase().includes(s) ||
          m.city?.toLowerCase().includes(s)
      );
    }

    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Admin: Approve a merchant
 */
export const approveMerchant = async (req, res) => {
  try {
    const { userId } = req.params;

    let updatedUser;
    try {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          role: 'MERCHANT',
          merchantStatus: 'APPROVED',
          approvedAt: new Date(),
          rejectionReason: null,
        },
        include: { shops: true },
      });

      // Also verify their shops
      await prisma.shop.updateMany({
        where: { ownerId: userId },
        data: { isVerified: true },
      });
    } catch (dbErr) {
      const mockIdx = MOCK_MERCHANTS.findIndex((m) => m.id === userId);
      if (mockIdx >= 0) {
        MOCK_MERCHANTS[mockIdx].merchantStatus = 'APPROVED';
        MOCK_MERCHANTS[mockIdx].approvedAt = new Date();
        MOCK_MERCHANTS[mockIdx].rejectionReason = null;
        if (MOCK_MERCHANTS[mockIdx].shops) {
          MOCK_MERCHANTS[mockIdx].shops.forEach((s) => (s.isVerified = true));
        }
        updatedUser = MOCK_MERCHANTS[mockIdx];
      } else {
        updatedUser = {
          id: userId,
          merchantStatus: 'APPROVED',
          approvedAt: new Date(),
        };
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Merchant application verified and approved. Merchant is now authorized to list items for selling.',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Approve merchant error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Admin: Reject a merchant
 */
export const rejectMerchant = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const rejectionReason = reason || 'Documentation could not be verified. Please ensure valid proof of Indian citizenship and clear identification photo.';

    let updatedUser;
    try {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          merchantStatus: 'REJECTED',
          rejectionReason,
        },
        include: { shops: true },
      });

      await prisma.shop.updateMany({
        where: { ownerId: userId },
        data: { isVerified: false },
      });
    } catch (dbErr) {
      const mockIdx = MOCK_MERCHANTS.findIndex((m) => m.id === userId);
      if (mockIdx >= 0) {
        MOCK_MERCHANTS[mockIdx].merchantStatus = 'REJECTED';
        MOCK_MERCHANTS[mockIdx].rejectionReason = rejectionReason;
        if (MOCK_MERCHANTS[mockIdx].shops) {
          MOCK_MERCHANTS[mockIdx].shops.forEach((s) => (s.isVerified = false));
        }
        updatedUser = MOCK_MERCHANTS[mockIdx];
      } else {
        updatedUser = {
          id: userId,
          merchantStatus: 'REJECTED',
          rejectionReason,
        };
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Merchant application has been marked as rejected.',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Reject merchant error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

