import { NextResponse } from 'next/server';
import PDFDocument from '@/models/PDFDocument';
import { getUserSession } from '@/lib/utils/sessionManager';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    const userId = await getUserSession();
    
    const documents = await PDFDocument.find({ userId })
      .sort({ uploadedAt: -1 })
      .limit(50)
      .lean();
    
    const formattedDocs = documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.originalName,
      size: doc.fileSize,
      type: 'application/pdf',
      uploadedAt: doc.uploadedAt,
      processed: doc.processed,
      pageCount: doc.pageCount
    }));
    
    return NextResponse.json({
      success: true,
      documents: formattedDocs
    });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document history' },
      { status: 500 }
    );
  }
}