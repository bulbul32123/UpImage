import React, { useState, useRef } from 'react';
import { Upload, X, Download, Loader2, CheckCircle2, XCircle, Eye, Trash2, AlertCircle } from 'lucide-react';

const BatchImageProcessor = ({ userTier = 'free' }) => {
  const [imageQueue, setImageQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(-1);
  const fileInputRef = useRef(null);

  const isPaidUser = userTier === 'paid' || userTier === 'premium' || userTier === 'pro';
  const maxBatchSize = isPaidUser ? 50 : 1;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (!isPaidUser && files.length > 1) {
      alert('Batch processing is available for paid users only. Please upgrade your plan.');
      return;
    }

    if (files.length > maxBatchSize) {
      alert(`You can process up to ${maxBatchSize} images at once.`);
      return;
    }

    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      status: 'pending',
      processedUrl: null,
      error: null,
      progress: 0
    }));

    setImageQueue(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImageQueue(prev => prev.filter(img => img.id !== id));
  };

  const clearCompleted = () => {
    setImageQueue(prev => prev.filter(img => img.status !== 'completed'));
  };

  const clearAll = () => {
    setImageQueue([]);
    setCurrentProcessingIndex(-1);
  };

  const processImage = async (image, index) => {
    try {
      setCurrentProcessingIndex(index);
      setImageQueue(prev => prev.map((img, i) => 
        i === index ? { ...img, status: 'processing', progress: 0 } : img
      ));

      const progressInterval = setInterval(() => {
        setImageQueue(prev => prev.map((img, i) => 
          i === index && img.progress < 90 
            ? { ...img, progress: img.progress + 10 } 
            : img
        ));
      }, 200);

      const formData = new FormData();
      formData.append('image', image.file);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const data = await response.json();
      const processedUrl = data?.processedUrl || data?.uploadResult?.secure_url;

      setImageQueue(prev => prev.map((img, i) => 
        i === index 
          ? { ...img, status: 'completed', processedUrl, progress: 100 } 
          : img
      ));
    } catch (error) {
      setImageQueue(prev => prev.map((img, i) => 
        i === index 
          ? { ...img, status: 'failed', error: error.message, progress: 0 } 
          : img
      ));
    }
  };

  const startBatchProcessing = async () => {
    if (!isPaidUser && imageQueue.length > 1) {
      alert('Batch processing is available for paid users only.');
      return;
    }

    setIsProcessing(true);

    for (let i = 0; i < imageQueue.length; i++) {
      if (imageQueue[i].status === 'pending' || imageQueue[i].status === 'failed') {
        await processImage(imageQueue[i], i);
      }
    }

    setIsProcessing(false);
    setCurrentProcessingIndex(-1);
  };

  const downloadImage = async (image) => {
    if (!image.processedUrl) return;

    try {
      const response = await fetch(image.processedUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `processed-${image.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to download the image.');
    }
  };

  const downloadAll = async () => {
    const completedImages = imageQueue.filter(img => img.status === 'completed');
    
    for (const image of completedImages) {
      await downloadImage(image);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const stats = {
    total: imageQueue.length,
    completed: imageQueue.filter(img => img.status === 'completed').length,
    failed: imageQueue.filter(img => img.status === 'failed').length,
    pending: imageQueue.filter(img => img.status === 'pending').length
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Batch Image Processing</h2>
            <p className="text-sm text-gray-600 mt-1">
              {isPaidUser 
                ? `Process up to ${maxBatchSize} images at once`
                : 'Upgrade to paid plan for batch processing'}
            </p>
          </div>
          {!isPaidUser && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              <p className="text-sm text-yellow-800 font-medium">Free Plan</p>
            </div>
          )}
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple={isPaidUser}
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Images
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {isPaidUser 
              ? `Drag and drop or click to browse (up to ${maxBatchSize} images)`
              : 'Single image processing (upgrade for batch)'}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Select Images
          </button>
        </div>
      </div>

      {imageQueue.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </div>
        </div>
      )}

      {imageQueue.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={startBatchProcessing}
                disabled={isProcessing || stats.pending === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Start Processing
                  </>
                )}
              </button>
              {stats.completed > 0 && (
                <button
                  onClick={downloadAll}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download All
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearCompleted}
                disabled={isProcessing || stats.completed === 0}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Clear Completed
              </button>
              <button
                onClick={clearAll}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {imageQueue.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Queue</h3>
          <div className="space-y-3">
            {imageQueue.map((image, index) => (
              <div
                key={image.id}
                className={`border rounded-lg p-4 transition-all ${
                  currentProcessingIndex === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={image.processedUrl || image.preview}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(image.size)}
                    </p>
                    {image.status === 'processing' && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${image.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {image.error && (
                      <p className="text-xs text-red-600 mt-1">{image.error}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    {getStatusIcon(image.status)}
                    <span className="text-sm text-gray-600 capitalize">
                      {image.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {image.status === 'completed' && (
                      <>
                        <button
                          onClick={() => downloadImage(image)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(image.processedUrl, '_blank')}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeImage(image.id)}
                      disabled={isProcessing && currentProcessingIndex === index}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {imageQueue.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No images in queue
          </h3>
          <p className="text-sm text-gray-600">
            Upload images to start batch processing
          </p>
        </div>
      )}
    </div>
  );
};

export default BatchImageProcessor;