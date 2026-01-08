import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import PDFDocument from '@/lib/db/models/PDFDocument';
import Summary from '@/lib/db/models/Summary';
import { getUserSession } from '@/lib/utils/sessionManager';
import { generateMockSummary } from '@/lib/utils/mockAI';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const userId = await getUserSession();
    const { pdfId } = params;
    
    const summaries = await Summary.find({
      pdfDocumentId: pdfId,
      userId
    }).sort({ generatedAt: -1 }).lean();
    
    const pdfDoc = await PDFDocument.findById(pdfId).lean();
    
    const formattedSummaries = summaries.map(summary => ({
      id: summary._id.toString(),
      type: summary.type,
      content: summary.content,
      fileName: pdfDoc?.originalName || 'Unknown',
      generatedAt: summary.generatedAt,
      wordCount: summary.wordCount
    }));
    
    return NextResponse.json({
      success: true,
      summaries: formattedSummaries
    });
  } catch (error) {
    console.error('Summary fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summaries' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    const userId = await getUserSession();
    const { pdfId } = params;
    const { type } = await request.json();
    
    if (!['brief', 'detailed', 'key-points', 'executive'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid summary type' },
        { status: 400 }
      );
    }
    
    const pdfDoc = await PDFDocument.findOne({
      _id: pdfId,
      userId
    });
    
    if (!pdfDoc) {
      return NextResponse.json(
        { error: 'PDF document not found' },
        { status: 404 }
      );
    }
    
    // Generate mock summary
    const content = generateMockSummary(type, pdfDoc.extractedText);
    const wordCount = content.split(/\s+/).length;
    
    // Save summary
    const summary = new Summary({
      pdfDocumentId: pdfId,
      userId,
      type,
      content,
      wordCount
    });
    await summary.save();
    
    return NextResponse.json({
      success: true,
      summary: {
        id: summary._id.toString(),
        type: summary.type,
        content: summary.content,
        fileName: pdfDoc.originalName,
        generatedAt: summary.generatedAt,
        wordCount: summary.wordCount
      }
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}