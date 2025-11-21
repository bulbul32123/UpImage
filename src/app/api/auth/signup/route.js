import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generateToken, setAuthCookie, validatePassword } from '@/lib/auth';

export async function POST(request) {
    try {
        await dbConnect();

        const { email, password, name } = await request.json();
        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields' },
                { status: 400 }
            );
        }
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Please provide a valid email address' },
                { status: 400 }
            );
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Password does not meet requirements',
                    errors: passwordValidation.errors
                },
                { status: 400 }
            );
        }
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User with this email already exists' },
                { status: 409 }
            );
        }
        const user = new User({
            email: email.toLowerCase(),
            password,
            name
        });
        await user.save();
        return NextResponse.json({
            success: true,
            message: 'Account created successfully. Please sign in.',
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                { success: false, message: messages.join(', ') },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: 'An error occurred during signup. Please try again.' },
            { status: 500 }
        );
    }
}