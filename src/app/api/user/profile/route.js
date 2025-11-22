// app/api/user/profile/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const wasReset = user.checkAndResetTokens();
    if (wasReset) {
      await user.save();
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      plan: user.plan,
      tokensImages: user.tokensImages,
      tokensText: user.tokensText,
      subscriptionStatus: user.subscriptionStatus,
      billingCycle: user.billingCycle,
      resetDate: user.resetDate,
      subscriptionEndDate: user.subscriptionEndDate,
      currency: user.currency,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}