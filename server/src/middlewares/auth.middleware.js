import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';

export const authenticateJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized access: Missing Bearer token' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'unretail_super_secret_jwt_key_change_in_production_2026';

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;

    // Dynamically synchronize live user details from database if available
    try {
      if (decoded.id && decoded.id !== 'admin_root') {
        const dbUser = await prisma.user.findUnique({
          where: { id: decoded.id },
          include: { shops: true },
        });

        if (dbUser) {
          req.user = {
            ...decoded,
            id: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
            merchantStatus: dbUser.merchantStatus,
            fullName: dbUser.fullName,
            shopName: dbUser.shopName,
            shops: dbUser.shops,
          };
        }
      }
    } catch (dbErr) {
      // Fallback gracefully to decoded JWT payload
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

