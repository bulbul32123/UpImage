import mongoose from 'mongoose';

const PDFDocumentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    cloudinaryUrl: {
        type: String,
        required: true
    },
    cloudinaryPublicId: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    pageCount: {
        type: Number,
        default: 0
    },
    mimeType: {
        type: String,
        default: 'application/pdf'
    },
    extractedText: {
        type: String,
        default: ''
    },
    textChunks: [{
        content: String,
        pageNumber: Number,
        chunkIndex: Number
    }],
    processed: {
        type: Boolean,
        default: false
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

PDFDocumentSchema.index({ userId: 1, uploadedAt: -1 });

export default mongoose.models.PDFDocument || mongoose.model('PDFDocument', PDFDocumentSchema);