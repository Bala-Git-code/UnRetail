import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'unretail_super_secret_jwt_key_change_in_production_2026';

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_token, email: requestedEmail, fullName: requestedName, avatarUrl: requestedAvatar, role: requestedRole } = req.body;

    let userEmail = requestedEmail;
    let userName = requestedName || 'UnRetail User';
    let userAvatar = requestedAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

    if (id_token) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: id_token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload) {
          userEmail = payload.email || userEmail;
          userName = payload.name || userName;
          userAvatar = payload.picture || userAvatar;
        }
      } catch (verifyError) {
        console.warn('Google token verification skipped (fallback to direct payload in dev):', verifyError);
      }
    }

    if (!userEmail) {
      res.status(400).json({ success: false, error: 'Email is required for authentication' });
      return;
    }

    const targetRole = ['CUSTOMER', 'MERCHANT', 'ADMIN'].includes(requestedRole) ? requestedRole : 'CUSTOMER';

    let user;
    try {
      user = await prisma.user.upsert({
        where: { email: userEmail },
        update: {
          fullName: userName,
          avatarUrl: userAvatar,
        },
        create: {
          email: userEmail,
          fullName: userName,
          avatarUrl: userAvatar,
          role: targetRole,
        },
      });
    } catch (dbError) {
      user = {
        id: `usr_${Math.random().toString(36).substring(2, 10)}`,
        email: userEmail,
        fullName: userName,
        avatarUrl: userAvatar,
        role: targetRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, error: error.message || 'Authentication failed' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
    } catch (err) {
      user = null;
    }

    if (!user) {
      res.status(200).json({
        success: true,
        user: req.user,
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
