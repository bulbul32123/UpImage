// app/api/subscription/status/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { PLANS } from '@/lib/stripe';

export async function GET(request) {
  try {
    await dbConnect();
    
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await User.findById(currentUser.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    user.checkAndResetTokens();
    await user.save();

    const planDetails = PLANS[user.plan];

    return NextResponse.json({
      success: true,
      subscription: {
        plan: user.plan,
        planName: planDetails?.name || 'Free',
        subscriptionStatus: user.subscriptionStatus,
        billingCycle: user.billingCycle,
        tokensImages: user.tokensImages,
        tokensText: user.tokensText,
        resetDate: user.resetDate,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        features: planDetails?.features || []
      }
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}