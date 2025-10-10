// pages/api/remove-bg.js
import formidable from 'formidable';
import fs from 'fs';
import cloudinary from 'cloudinary';
import connect from '../../lib/dbConnect';
import Job from '../../models/Job';

export const config = {
  api: {
    bodyParser: false, // we use formidable
    sizeLimit: '10mb', // increase to something safe for your images
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function parseForm(req) {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

async function uploadToCloudinary(filePath, publicIdPrefix = 'remove_bg_') {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const public_id = `${publicIdPrefix}${timestamp}`;
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: 'image',
        public_id,
        background_removal: 'cloudinary_ai',
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    fs.createReadStream(filePath).pipe(uploadStream);
  });
}

async function pollForProcessedUrl(public_id, maxAttempts = 20, intervalMs = 1000) {
  // polling Cloudinary resource metadata to detect processed PNG/updated version
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await cloudinary.v2.api.resource(public_id, { resource_type: 'image' });
      // Cloudinary may overwrite or create a new version with .png extension / or provide background_removal result
      // Many responses include metadata for background_removal or a new secure_url ending with .png
      // Check if secure_url endsWith .png
      if (res?.secure_url && res.secure_url.toLowerCase().endsWith('.png')) {
        return { processedUrl: res.secure_url, meta: res };
      }

      // Alternatively, some Cloudinary setups create a derived asset in eager transformations:
      // Check for 'derived' assets
      if (res?.derived && res.derived.length) {
        const pngDerived = res.derived.find(d => d.secure_url && d.secure_url.endsWith('.png'));
        if (pngDerived) return { processedUrl: pngDerived.secure_url, meta: res };
      }

      // Also sometimes the upload response gives background_removal object; check resource details
      if (res?.background_removal && res.background_removal?.status === 'complete' && res.background_removal?.result?.secure_url) {
        return { processedUrl: res.background_removal.result.secure_url, meta: res };
      }

    } catch (err) {
      // resource may not be ready yet -> ignore and retry
      // But if error is 404, we still want to retry
    }
    // wait
    await new Promise(r => setTimeout(r, intervalMs));
  }

  // after max attempts return null
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  console.log('Connected to DB');
  try {
    await connect();
    console.log('Connected to DB');

    const { files } = await parseForm(req);
    const fileKey = Object.keys(files)[0];
    if (!fileKey) return res.status(400).json({ error: 'No file uploaded' });

    const file = files[fileKey];
    const filePath = file.filepath || file.path || file.path; // depending on formidable version

    // Save initial job
    const job = new Job({
      originalUrl: null,
      status: 'processing',
    });
    await job.save();

    // Upload to Cloudinary with background_removal
    const uploadResult = await uploadToCloudinary(filePath);

    // Save original info in job
    job.originalPublicId = uploadResult.public_id;
    job.originalUrl = uploadResult.secure_url;
    await job.save();

    // Poll for processed PNG (background removed)
    const poll = await pollForProcessedUrl(uploadResult.public_id, 25, 1000); // ~25s max
    if (!poll) {
      job.status = 'failed';
      job.cloudinaryResult = { uploadResult };
      await job.save();
      return res.status(500).json({ error: 'Background removal timed out. It may still be processing on Cloudinary. Check later.', uploadResult });
    }

    job.processedUrl = poll.processedUrl;
    job.status = 'done';
    job.cloudinaryResult = poll.meta;
    await job.save();

    // clean temp file
    try { fs.unlinkSync(filePath); } catch (e) { }

    return res.status(200).json({
      message: 'Background removed',
      processedUrl: poll.processedUrl,
      jobId: job._id,
      cloudinaryMeta: poll.meta,
    });

  } catch (err) {
    console.error('remove-bg error', err);
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}
