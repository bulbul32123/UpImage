// app/api/stripe/webhook/route.js
import { NextResponse } from 'next/server';
import { stripe, PLANS } from '@/lib/stripe';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { headers } from 'next/headers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;
  const billingCycle = session.metadata?.billingCycle;

  if (!userId || !plan || !billingCycle) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    console.error('User not found:', userId);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription);

  user.plan = plan;
  user.subscriptionStatus = 'active';
  user.subscriptionId = session.subscription;
  user.stripeCustomerId = session.customer;
  user.billingCycle = billingCycle;
  user.subscriptionStartDate = new Date(subscription.current_period_start * 1000);
  user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
  
  const planConfig = PLANS[plan];
  user.tokensImages = planConfig.tokensImages;
  user.tokensText = planConfig.tokensText;

  const now = new Date();
  if (billingCycle === 'monthly') {
    user.resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else {
    user.resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  await user.save();
  console.log(`Subscription activated for user ${userId}, plan: ${plan}`);
}

async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({ subscriptionId: subscription.id });
  if (!user) {
    console.error('User not found for subscription:', subscription.id);
    return;
  }

  user.subscriptionStatus = subscription.status;
  user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);

  if (subscription.status === 'canceled' || subscription.cancel_at_period_end) {
    user.subscriptionStatus = 'canceled';
  }

  await user.save();
  console.log(`Subscription updated for user ${user._id}, status: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({ subscriptionId: subscription.id });
  if (!user) {
    console.error('User not found for subscription:', subscription.id);
    return;
  }
  user.plan = 'free';
  user.subscriptionStatus = 'inactive';
  user.subscriptionId = null;
  user.billingCycle = null;
  user.subscriptionStartDate = null;
  user.subscriptionEndDate = null;
  user.tokensImages = 10;
  user.tokensText = 3;
  
  const now = new Date();
  user.resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  await user.save();
  console.log(`Subscription deleted, user ${user._id} reverted to free plan`);
}

async function handleInvoicePaymentSucceeded(invoice) {
  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  if (!user) {
    console.error('User not found for customer:', invoice.customer);
    return;
  }
  if (user.plan !== 'free') {
    user.resetTokens();
    await user.save();
    console.log(`Tokens reset for user ${user._id} after successful payment`);
  }
}

async function handleInvoicePaymentFailed(invoice) {
  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  if (!user) {
    console.error('User not found for customer:', invoice.customer);
    return;
  }

  user.subscriptionStatus = 'past_due';
  await user.save();
  console.log(`Payment failed for user ${user._id}, status set to past_due`);
}