// app/api/delete-image/route.js
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const extractPublicId = (url) => {
    if (!url || typeof url !== "string") return null;

    try {
        const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/;
        const match = url.match(regex);

        if (match && match[1]) {
            return match[1];
        }

        return null;
    } catch (error) {
        console.error("Error extracting public_id:", error);
        return null;
    }
};

const isValidCloudinaryUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};
export async function DELETE(request) {
    try {
        const authResult = await verifyAuth(request);
        if (!authResult.authenticated) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized',
                    error: 'User not authenticated'
                },
                { status: 401 }
            );
        }

        const userId = authResult.userId;
        const body = await request.json();
        const { url } = body;
        if (!url) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid request',
                    error: 'Image URL is required'
                },
                { status: 400 }
            );
        }

        if (!isValidCloudinaryUrl(url)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid URL',
                    error: 'URL must be a valid Cloudinary image URL'
                },
                { status: 400 }
            );
        }
        const publicId = extractPublicId(url);

        if (!publicId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid image URL format',
                    error: 'Could not extract image ID from URL'
                },
                { status: 400 }
            );
        }

        console.log(`[DELETE IMAGE] User: ${userId}, Public ID: ${publicId}`);

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true, // Invalidate CDN cache
        });

        // Check if deletion was successful
        if (result.result === 'ok') {
            console.log(`[DELETE IMAGE SUCCESS] Public ID: ${publicId} deleted successfully`);

            return NextResponse.json(
                {
                    success: true,
                    message: 'Image deleted successfully',
                    deletedUrl: url,
                    publicId: publicId
                },
                { status: 200 }
            );
        } else if (result.result === 'not found') {
            // Image already deleted or doesn't exist
            console.warn(`[DELETE IMAGE] Public ID: ${publicId} not found`);

            return NextResponse.json(
                {
                    success: true,
                    message: 'Image not found or already deleted',
                    deletedUrl: url,
                    publicId: publicId
                },
                { status: 200 }
            );
        } else {
            console.error(`[DELETE IMAGE ERROR] Unexpected result:`, result);

            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to delete image',
                    error: result.result || 'Unknown error'
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('[DELETE IMAGE EXCEPTION]', error);

        // Handle specific error types
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid JSON',
                    error: 'Request body must be valid JSON'
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Failed to delete image'
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const authResult = await verifyAuth(request);
        if (!authResult.authenticated) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized',
                    error: 'User not authenticated'
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid request',
                    error: 'Image URL is required'
                },
                { status: 400 }
            );
        }

        if (!isValidCloudinaryUrl(url)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid URL',
                    error: 'URL must be a valid Cloudinary image URL'
                },
                { status: 400 }
            );
        }

        const publicId = extractPublicId(url);
        if (!publicId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid image URL format',
                    error: 'Could not extract image ID from URL'
                },
                { status: 400 }
            );
        }

        console.log(`[DELETE IMAGE POST] User: ${authResult.userId}, Public ID: ${publicId}`);

        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
        });

        if (result.result === 'ok' || result.result === 'not found') {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Image deleted successfully',
                    deletedUrl: url,
                    publicId: publicId
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to delete image',
                    error: result.result || 'Unknown error'
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('[DELETE IMAGE POST EXCEPTION]', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid JSON',
                    error: 'Request body must be valid JSON'
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Failed to delete image'
            },
            { status: 500 }
        );
    }
}