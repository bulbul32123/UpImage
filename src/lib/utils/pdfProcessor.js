import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload PDF to Cloudinary
 */
export async function uploadPDFToCloudinary(file, userId) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: `pdf-chat/${userId}`,
          format: 'pdf'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload PDF to Cloudinary');
  }
}

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(buffer) {
  try {
    const pdfParse = require("pdf-parse");
    return {
      text: data.text,
      pageCount: data.numpages
    };
  } catch (error) {
    console.error('PDF text extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Chunk text for AI processing
 */
export function chunkText(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.substring(start, end);

    chunks.push({
      content: chunk.trim(),
      chunkIndex: chunkIndex++,
      pageNumber: Math.floor(chunkIndex / 2) + 1 // Approximate
    });

    start += chunkSize - overlap;
  }

  return chunks;
}

/**
 * Find relevant chunks for a query (simple keyword matching)
 */
export function findRelevantChunks(query, chunks, maxChunks = 3) {
  const queryWords = query.toLowerCase().split(/\s+/);

  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const score = queryWords.reduce((sum, word) => {
      const occurrences = (content.match(new RegExp(word, 'g')) || []).length;
      return sum + occurrences;
    }, 0);

    return { ...chunk, score, originalIndex: index };
  });

  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}

/**
 * Delete PDF from Cloudinary
 */
export async function deletePDFFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
  }
}




src/models/Summary.js