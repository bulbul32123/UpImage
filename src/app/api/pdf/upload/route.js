import { NextResponse } from 'next/server';
import PDFDocument from '@/models/PDFDocument';
import { uploadPDFToCloudinary, extractTextFromPDF, chunkText } from '@/lib/utils/pdfProcessor';
import { getUserSession } from '@/lib/utils/sessionManager';
import dbConnect from '@/lib/dbConnect';

export async function POST(request) {
  try {
    await dbConnect();
    const userId = await getUserSession();
    console.log('userId', userId);


    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    const uploadResult = await uploadPDFToCloudinary(file, userId);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const { text, pageCount } = await extractTextFromPDF(buffer);

    const chunks = chunkText(text);
    const pdfDocument = new PDFDocument({
      userId,
      filename: uploadResult.public_id.split('/').pop(),
      originalName: file.name,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      fileSize: file.size,
      pageCount,
      extractedText: text,
      textChunks: chunks,
      processed: true
    });

    await pdfDocument.save();

    return NextResponse.json({
      success: true,
      document: {
        id: pdfDocument._id.toString(),
        name: pdfDocument.originalName,
        size: pdfDocument.fileSize,
        type: 'application/pdf',
        uploadedAt: pdfDocument.uploadedAt,
        processed: pdfDocument.processed,
        pageCount: pdfDocument.pageCount,
        cloudinaryUrl: pdfDocument.cloudinaryUrl
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload PDF' },
      { status: 500 }
    );
  }
}
