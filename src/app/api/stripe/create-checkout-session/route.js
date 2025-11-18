import { NextResponse } from 'next/server';
import { stripe, getPriceId } from '@/lib/stripe';
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

    const { plan, billingCycle, currency = 'usd' } = await request.json();
    if (!plan || !billingCycle || !['basic', 'pro'].includes(plan)) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan or billing cycle' },
        { status: 400 }
      );
    }

    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { success: false, message: 'Invalid billing cycle' },
        { status: 400 }
      );
    }

    if (!['usd', 'bdt'].includes(currency.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: 'Invalid currency' },
        { status: 400 }
      );
    }

    const user = await User.findById(currentUser.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    const priceId = getPriceId(plan, billingCycle, currency.toUpperCase());
    if (!priceId) {
      return NextResponse.json(
        { success: false, message: 'Price configuration not found' },
        { status: 400 }
      );
    }
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user._id.toString(),
        plan: plan,
        billingCycle: billingCycle
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required'
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}