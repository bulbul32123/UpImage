// app/api/subscription/cancel/route.js
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request) {
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

    if (!user.subscriptionId) {
      return NextResponse.json(
        { success: false, message: 'No active subscription found' },
        { status: 400 }
      );
    }
    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true
    });

    user.subscriptionStatus = 'canceled';
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}