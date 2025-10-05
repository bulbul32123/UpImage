// models/Job.js
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  originalPublicId: String,
  originalUrl: String,
  processedUrl: String,
  status: { type: String, enum: ['pending','processing','done','failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  cloudinaryResult: mongoose.Schema.Types.Mixed,
});

JobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
