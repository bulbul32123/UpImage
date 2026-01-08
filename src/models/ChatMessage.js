import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
    pdfDocumentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDFDocument',
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    metadata: {
        relevantChunks: [Number],
        confidence: Number
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

ChatMessageSchema.index({ pdfDocumentId: 1, timestamp: 1 });

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
