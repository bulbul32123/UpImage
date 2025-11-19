import dbConnect from './dbConnect';
import User from '@/models/User';
import { getCurrentUser } from './auth';
import { NextResponse } from 'next/server';

export async function checkTokens(tokenType) {
  try {
    await dbConnect();
    
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: 'Not authenticated',
        status: 401
      };
    }

    const user = await User.findById(currentUser.userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        status: 404
      };
    }

    user.checkAndResetTokens();

    if (!user.hasTokens(tokenType)) {
      return {
        success: false,
        error: 'Insufficient tokens',
        needsUpgrade: true,
        plan: user.plan,
        tokensImages: user.tokensImages,
        tokensText: user.tokensText,
        status: 403
      };
    }

    const deducted = user.deductToken(tokenType);
    if (!deducted) {
      return {
        success: false,
        error: 'Failed to deduct token',
        status: 500
      };
    }

    await user.save();

    return {
      success: true,
      user: user,
      tokensRemaining: {
        images: user.tokensImages,
        text: user.tokensText
      }
    };

  } catch (error) {
    console.error('Token check error:', error);
    return {
      success: false,
      error: 'Server error',
      status: 500
    };
  }
}

export function createTokenResponse(result) {
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: result.error,
        needsUpgrade: result.needsUpgrade || false,
        plan: result.plan,
        tokensImages: result.tokensImages,
        tokensText: result.tokensText
      },
      { status: result.status || 500 }
    );
  }
  return null;
}