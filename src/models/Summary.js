import mongoose from 'mongoose';

const SummarySchema = new mongoose.Schema({
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
        enum: ['brief', 'detailed', 'key-points', 'executive'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    wordCount: {
        type: Number,
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

SummarySchema.index({ pdfDocumentId: 1, type: 1 });

export default mongoose.models.Summary || mongoose.model('Summary', SummarySchema);