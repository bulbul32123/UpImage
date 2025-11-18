// app/api/user/usage-history/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import UsageLog from '@/models/UsageLog';

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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const logs = await UsageLog.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await UsageLog.countDocuments({ userId: user._id });
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    const monthlyStats = await UsageLog.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: currentMonth }
        }
      },
      {
        $group: {
          _id: '$toolType',
          count: { $sum: 1 },
          tokensUsed: { $sum: '$tokensUsed' }
        }
      }
    ]);

    const stats = {
      image: { count: 0, tokensUsed: 0 },
      text: { count: 0, tokensUsed: 0 }
    };

    monthlyStats.forEach(stat => {
      stats[stat._id] = {
        count: stat.count,
        tokensUsed: stat.tokensUsed
      };
    });

    return NextResponse.json({
      logs,
      stats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Usage history fetch error')
  }
}