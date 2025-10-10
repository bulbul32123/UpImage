import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
    try {
        await dbConnect();

        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        // Find user and include password field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken(user._id.toString());

        // Set HTTP-only cookie
      await  setAuthCookie(token);
        return NextResponse.json({
            success: true,
            message: 'Signed in successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Signin error:', error);

        return NextResponse.json(
            { success: false, message: 'An error occurred during signin. Please try again.' },
            { status: 500 }
        );
    }
}