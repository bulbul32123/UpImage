import sharp from "sharp";
import { NextResponse } from "next/server";
import { checkTokens, createTokenResponse } from "@/lib/tokenMiddleware";

export async function POST(req) {
    try {
        const tokenCheck = await checkTokens('image');
        const tokenError = createTokenResponse(tokenCheck);
        if (tokenError) return tokenError;

        const formData = await req.formData();
        const file = formData.get("file");
        const targetFormat = formData.get("targetFormat");

        if (!file || !targetFormat) {
            return NextResponse.json(
                { error: "File and targetFormat are required" },
                { status: 400 }
            );
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let convertedBuffer;
        switch (targetFormat) {
            case "png":
                convertedBuffer = await sharp(buffer).png().toBuffer();
                break;
            case "jpg":
            case "jpeg":
                convertedBuffer = await sharp(buffer).jpeg().toBuffer();
                break;
            case "webp":
                convertedBuffer = await sharp(buffer).webp().toBuffer();
                break;
            default:
                return NextResponse.json(
                    { error: "Unsupported target format" },
                    { status: 400 }
                );
        }
        return new NextResponse(convertedBuffer, {
            status: 200,
            headers: {
                "Content-Type": `image/${targetFormat}`,
                "Content-Disposition": `attachment; filename=converted.${targetFormat}`,
                "X-Tokens-Remaining-Images": tokenCheck.tokensRemaining.images.toString(),
                "X-Tokens-Remaining-Text": tokenCheck.tokensRemaining.text.toString()
            }
        });
    } catch (err) {
        console.error("Conversion error:", err);
        return NextResponse.json(
            { error: "Conversion failed" },
            { status: 500 }
        );
    }
}