import { NextResponse } from 'next/server';
import PDFDocument from '@/models/PDFDocument';
import ChatMessage from '@/models/ChatMessage';
import { getUserSession } from '@/lib/utils/sessionManager';
import { findRelevantChunks } from '@/lib/utils/pdfProcessor';
import { generateMockChatResponse } from '@/lib/utils/mockAI';
import dbConnect from '@/lib/dbConnect';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const userId = await getUserSession();
    console.log('userId', userId);
    
    const { pdfId } = params;
    
    const messages = await ChatMessage.find({
      pdfDocumentId: pdfId,
      userId
    }).sort({ timestamp: 1 }).lean();
    
    const formattedMessages = messages.map(msg => ({
      id: msg._id.toString(),
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp
    }));
    
    return NextResponse.json({
      success: true,
      messages: formattedMessages
    });
  } catch (error) {
    console.error('Chat history fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    const userId = await getUserSession();
    const { pdfId } = params;
    const { message } = await request.json();
    
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Get PDF document with chunks
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
    
    // Save user message
    const userMessage = new ChatMessage({
      pdfDocumentId: pdfId,
      userId,
      type: 'user',
      content: message.trim()
    });
    await userMessage.save();
    
    // Find relevant chunks
    const relevantChunks = findRelevantChunks(
      message,
      pdfDoc.textChunks,
      3
    );
    
    // Generate mock AI response
    const aiResponse = generateMockChatResponse(message, relevantChunks);
    
    // Save assistant message
    const assistantMessage = new ChatMessage({
      pdfDocumentId: pdfId,
      userId,
      type: 'assistant',
      content: aiResponse,
      metadata: {
        relevantChunks: relevantChunks.map(c => c.originalIndex)
      }
    });
    await assistantMessage.save();
    
    return NextResponse.json({
      success: true,
      userMessage: {
        id: userMessage._id.toString(),
        type: userMessage.type,
        content: userMessage.content,
        timestamp: userMessage.timestamp
      },
      assistantMessage: {
        id: assistantMessage._id.toString(),
        type: assistantMessage.type,
        content: assistantMessage.content,
        timestamp: assistantMessage.timestamp
      }
    });
  } catch (error) {
    console.error('Chat message error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}