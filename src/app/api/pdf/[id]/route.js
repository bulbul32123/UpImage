import { NextResponse } from 'next/server';
import PDFDocument from '@/models/PDFDocument';
import { getUserSession } from '@/lib/utils/sessionManager';
import dbConnect from '@/lib/dbConnect';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const userId = await getUserSession();
    const { id } = params;
    
    const document = await PDFDocument.findOne({
      _id: id,
      userId
    }).lean();
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      document: {
        id: document._id.toString(),
        name: document.originalName,
        size: document.fileSize,
        type: 'application/pdf',
        uploadedAt: document.uploadedAt,
        processed: document.processed,
        pageCount: document.pageCount,
        cloudinaryUrl: document.cloudinaryUrl
      }
    });
  } catch (error) {
    console.error('Document fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}