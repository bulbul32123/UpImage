import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();
    console.log("currentUser: ", currentUser);


    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await User.findById(currentUser.userId);
    console.log("user: ", user);


    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { ...user._doc }
    }, { status: 200 });

  } catch (error) {
    console.error('Get user error:', error);

    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}