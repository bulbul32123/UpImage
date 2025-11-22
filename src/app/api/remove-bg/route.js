import cloudinary from 'cloudinary';
import connect from '@/lib/dbConnect';
import Job from '@/models/Job';
import { checkTokens, createTokenResponse } from '@/lib/tokenMiddleware';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function pollForProcessedUrl(publicId, maxAttempts = 20, intervalMs = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const res = await cloudinary.v2.api.resource(publicId, { resource_type: "image" });

            if (res.derived?.length) {
                const png = res.derived.find(d => d.secure_url.endsWith(".png"));
                if (png) return png.secure_url;
            }

            if (res.secure_url?.endsWith(".png")) {
                return res.secure_url;
            }
        } catch (e) {
        }
        await new Promise(r => setTimeout(r, intervalMs));
    }
    return null;
}

export async function POST(req) {
    try {
        const tokenCheck = await checkTokens('image');
        const tokenError = createTokenResponse(tokenCheck);
        if (tokenError) return tokenError;

        await connect();

        const formData = await req.formData();
        const file = formData.get('image');

        if (!file || !file.arrayBuffer) {
            return new Response(
                JSON.stringify({ error: 'No file uploaded' }),
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: 'image',
                    background_removal: 'cloudinary_ai',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        const job = await Job.create({
            originalPublicId: uploadResult.public_id,
            originalUrl: uploadResult.secure_url,
            processedUrl: uploadResult.secure_url,
            status: 'done',
            cloudinaryResult: uploadResult,
        });

        const processedUrl = await pollForProcessedUrl(uploadResult.public_id);

        return new Response(
            JSON.stringify({
                message: "Background removed",
                processedUrl: processedUrl || uploadResult.secure_url,
                jobId: job._id,
                tokensRemaining: {
                    images: tokenCheck.tokensRemaining.images,
                    text: tokenCheck.tokensRemaining.text
                }
            }),
            { status: 200 }
        );

    } catch (err) {
        console.error('remove-bg error', err);
        return new Response(
            JSON.stringify({ error: err.message || 'Server error' }),
            { status: 500 }
        );
    }
}