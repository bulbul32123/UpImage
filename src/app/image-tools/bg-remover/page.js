"use client"
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ImageUploadZone from '../../../components/image-processing-tools/ImageUploadZone';
import ImagePreviewArea from '../../../components/image-processing-tools/ImagePreviewArea';
import FileHistorySidebar from '@/components/image-processing-tools/FileHistorySidebar';
import { Link } from 'lucide-react';
import Image from '@/components/AppImage';
import { usePersistentQueue } from '@/hooks/usePersistentQueue';

const BgRemoverTool = ({ userTier = 'paid' }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Batch processing states
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [imageQueue, setImageQueue] = usePersistentQueue("batchQueue", []);

  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(-1);

  // Modal states
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [selectedImageForView, setSelectedImageForView] = useState(null);

  const isPaidUser = userTier === 'paid' || userTier === 'premium' || userTier === 'pro';
  const maxBatchSize = isPaidUser ? 50 : 1;

  const acceptedFormats = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB


  const handleFilesSelected = (files) => {
    if (isBatchMode && isPaidUser) {
      // Batch mode for paid users
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
    } else {
      // Single mode
      setSelectedFiles(files);
      if (files?.length > 0) {
        const file = files[0];
        const imageUrl = URL.createObjectURL(file);
        setCurrentImage(imageUrl);
        setProcessedImage(null);
        handleProcess(file);
      }
    }
  };

  const handleProcess = async (file = null, settings = {}) => {
    const targetFile = file || selectedFiles?.[0];
    if (!targetFile) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image', targetFile);

      const resp = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error('Remove BG failed', text);
      }

      const data = await resp.json();
      setProcessedImage(data?.processedUrl || data?.uploadResult?.secure_url || null);
    } catch (err) {
      console.error(err);
      alert('Background removal failed. Check console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Batch processing functions
  const processBatchImage = async (image, index) => {
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
        await processBatchImage(imageQueue[i], i);
      }
    }

    setIsProcessing(false);
    setCurrentProcessingIndex(-1);
  };

  const removeFromQueue = (id) => {
    setImageQueue(prev => prev.filter(img => img.id !== id));
  };

  const clearCompleted = () => {
    setImageQueue(prev => prev.filter(img => img.status !== 'completed'));
  };

  const clearAllQueue = () => {
    setImageQueue([]);
    setCurrentProcessingIndex(-1);
  };

  const downloadBatchImage = async (image) => {
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

  const downloadAllBatch = async () => {
    const completedImages = imageQueue.filter(img => img.status === 'completed');
    if (completedImages.length === 0) return;

    const zip = new JSZip();

    for (const image of completedImages) {
      if (!image.processedUrl) continue;

      try {
        const response = await fetch(image.processedUrl);
        const blob = await response.blob();

        const baseName = image.name.replace(/\.[^/.]+$/, "");
        const ext = image.processedUrl.split('.').pop().split('?')[0] || 'png';

        zip.file(`${baseName}-bgremoved.${ext}`, blob);
      } catch (error) {
        console.error(`Failed to fetch image: ${image.name}`, error);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "bgremoved-images.zip");
  };


  const toggleBatchMode = () => {
    if (!isPaidUser) {
      alert('Batch processing is available for paid users only. Please upgrade your plan.');
      return;
    }
    setIsBatchMode(!isBatchMode);
    setCurrentImage(null);
    setProcessedImage(null);
    setSelectedFiles([]);
  };

  const openComparisonModal = (image) => {
    setSelectedImageForView(image);
    setShowComparisonModal(true);
  };

  const closeComparisonModal = () => {
    setShowComparisonModal(false);
    setSelectedImageForView(null);
  };

  const getBreadcrumbItems = () => [
    { label: 'Dashboard', path: '/dashboard-overview' },
    { label: 'Image Tools', path: '/image-processing-tools' }
  ];

  const handleDownload = async () => {
    if (!processedImage) return;

    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `processed-image-${Date.now()}.png`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to download the image.');
    }
  };

  const handleFileSelect = (file) => {
    setCurrentImage(file?.thumbnail);
    setProcessedImage(file?.thumbnail);
    setIsHistoryOpen(false);
  };

  const handleFullScreen = () => {
    if (!processedImage) return;

    const newWindow = window.open('', '_blank');
    newWindow?.document?.write(`
      <html>
        <head><title>Full Screen Preview</title></head>
        <body style="margin:0;padding:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;">
          <img src="${processedImage}" style="max-width:100%;max-height:100%;object-fit:contain;" />
        </body>
      </html>
    `);
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
        return 'CheckCircle';
      case 'failed':
        return 'XCircle';
      case 'processing':
        return 'Loader2';
      default:
        return 'Clock';
    }
  };

  const stats = {
    total: imageQueue.length,
    completed: imageQueue.filter(img => img.status === 'completed').length,
    failed: imageQueue.filter(img => img.status === 'failed').length,
    pending: imageQueue.filter(img => img.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            {getBreadcrumbItems()?.map((item, index) => (
              <React.Fragment key={item?.path}>
                {index > 0 && <Icon name="ChevronRight" size={16} />}
                {index === getBreadcrumbItems()?.length - 1 ? (
                  <span className="text-foreground font-medium">{item?.label}</span>
                ) : (
                  <Link
                    href={item?.path}
                    className="hover:text-foreground transition-colors"
                  >
                    {item?.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-fluid-3xl font-semibold text-foreground mb-2">
                Image Background Remover
              </h1>
              <p className="text-muted-foreground">
                Professional image editing with AI-powered background removal, enhancement, and format conversion
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant={isBatchMode ? "default" : "outline"}
                onClick={toggleBatchMode}
                iconName="Layers"
                iconPosition="left"
              >
                {isBatchMode ? 'Batch Mode' : 'Single Mode'}
              </Button>
              {!isPaidUser && (
                <div className="px-3 py-1 bg-warning/10 text-warning rounded-md text-sm">
                  Free Plan
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                iconName="History"
                iconPosition="left"
              >
                History
              </Button>
            </div>
          </div>

          {/* Single Mode */}
          {!isBatchMode && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 mt-8">
              <div className="xl:col-span-2 space-y-6">
                {!currentImage && (
                  <ImageUploadZone
                    onFilesSelected={handleFilesSelected}
                    acceptedFormats={acceptedFormats}
                    maxFileSize={maxFileSize}
                    isProcessing={isProcessing}
                    multiple={false}
                  />
                )}

                {currentImage && (
                  <ImagePreviewArea
                    originalImage={currentImage}
                    processedImage={processedImage}
                    isProcessing={isProcessing}
                    onDownload={handleDownload}
                    onFullScreen={handleFullScreen}
                  />
                )}

                {currentImage && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentImage(null);
                        setProcessedImage(null);
                        setSelectedFiles([]);
                      }}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Upload New Image
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Batch Mode */}
          {isBatchMode && isPaidUser && (
            <div className="space-y-6">
              {/* Upload Zone for Batch */}
              <div className="bg-card border border-border rounded-lg p-6">
                <ImageUploadZone
                  onFilesSelected={handleFilesSelected}
                  acceptedFormats={acceptedFormats}
                  maxFileSize={maxFileSize}
                  isProcessing={isProcessing}
                  multiple={true}
                />
              </div>

              {/* Stats */}
              {imageQueue.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-semibold text-success">{stats.completed}</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-semibold text-muted-foreground">{stats.pending}</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-2xl font-semibold text-destructive">{stats.failed}</p>
                  </div>
                </div>
              )}

              {/* Controls */}
              {imageQueue.length > 0 && (
                <div className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <Button
                        onClick={startBatchProcessing}
                        disabled={isProcessing || stats.pending === 0}
                        iconName="Play"
                        iconPosition="left"
                      >
                        {isProcessing ? 'Processing...' : 'Start Processing'}
                      </Button>
                      {stats.completed > 0 && (
                        <Button
                          variant="outline"
                          onClick={downloadAllBatch}
                          disabled={isProcessing}
                          iconName="Download"
                          iconPosition="left"
                        >
                          Download All
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCompleted}
                        disabled={isProcessing || stats.completed === 0}
                      >
                        Clear Completed
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllQueue}
                        disabled={isProcessing}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Queue */}
              {imageQueue.length > 0 && (
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Image Queue</h3>
                  <div className="space-y-3">
                    {imageQueue.map((image, index) => (
                      <div
                        key={image.id}
                        className={`border rounded-lg p-4 transition-all ${currentProcessingIndex === index
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={image.processedUrl || image.preview}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {image.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(image.size)}
                            </p>
                            {image.status === 'processing' && (
                              <div className="mt-2">
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${image.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {image.error && (
                              <p className="text-xs text-destructive mt-1">{image.error}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <Icon
                              name={getStatusIcon(image.status)}
                              size={20}
                              className={image.status === 'processing' ? 'animate-spin' : ''}
                            />
                            <span className="text-sm text-muted-foreground capitalize">
                              {image.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {image.status === 'completed' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => downloadBatchImage(image)}
                                >
                                  <Icon name="Download" size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openComparisonModal(image)}
                                >
                                  <Icon name="Eye" size={16} />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromQueue(image.id)}
                              disabled={isProcessing && currentProcessingIndex === index}
                            >
                              <Icon name="X" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {imageQueue.length === 0 && (
                <div className="bg-card rounded-lg p-12 text-center border border-border">
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No images in queue
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Upload images to start batch processing
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <FileHistorySidebar
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        onFileSelect={handleFileSelect}
      />

      {/* Comparison Modal */}
      {showComparisonModal && selectedImageForView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeComparisonModal}
        >
          <div
            className="relative w-2xl h-[40rem] mx-4 bg-card rounded-lg shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Image Comparison
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedImageForView.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeComparisonModal}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Original */}
              <div className="p-4 space-y-2">
                <h4 className="text-sm font-medium text-foreground">Original</h4>
                <div
                  className="relative bg-muted rounded overflow-hidden"
                  style={{ height: "300px" }}
                >
                  <Image
                    src={selectedImageForView?.preview || originalImage}
                    alt="Original image"
                    className="w-full h-full object-contain transition-transform duration-200"
                  />
                </div>
              </div>

              {/* Processed */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">Processed</h4>
                  {processedImage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadBatchImage(selectedImageForView)}
                      iconName="Download"
                      iconPosition="left"
                    >
                      Download
                    </Button>
                  )}
                </div>

                <div
                  className="relative bg-muted rounded overflow-hidden"
                  style={{ height: "300px" }}
                >
                  {showComparisonModal && selectedImageForView && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                      onClick={closeComparisonModal}
                    >
                      <div
                        className="relative w-2xl h-[40rem] mx-4 bg-card rounded-lg shadow-2xl border border-border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground">
                              Image Comparison
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedImageForView.name}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={closeComparisonModal}
                          >
                            <Icon name="X" size={20} />
                          </Button>
                        </div>

                        {/* Modal Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border border-b">
                          {/* Original */}
                          <div className="p-4 space-y-2">
                            <h4 className="text-sm font-medium text-foreground">Original</h4>
                            <div
                              className="relative bg-muted rounded"
                              style={{ height: "300px" }}
                            >
                              <Image
                                src={selectedImageForView?.preview}
                                alt="Original image"
                                className="w-full h-full object-contain transition-transform duration-200"
                              />
                            </div>
                          </div>

                          {/* Processed */}
                          <div className="flex flex-col justify-end p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-foreground">Processed</h4>
                            </div>

                            <div
                              className="relative bg-muted rounded overflow-hidden"
                              style={{ height: "300px" }}
                            >
                              {selectedImageForView?.status === "processing" ? (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="text-center space-y-2">
                                    <Icon
                                      name="Loader2"
                                      size={32}
                                      className="animate-spin text-primary"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                      Processing image...
                                    </p>
                                  </div>

                                </div>
                              ) : selectedImageForView?.processedUrl ? (
                                <Image
                                  src={selectedImageForView.processedUrl}
                                  alt="Processed image"
                                  className="w-full h-full object-contain transition-transform duration-200"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="text-center space-y-2">
                                    <Icon
                                      name="Clock"
                                      size={32}
                                      color="var(--color-muted-foreground)"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                      Waiting for processing
                                    </p>
                                  </div>

                                </div>
                              )}
                            </div>
                            {selectedImageForView?.processedUrl && (
                              <Button
                                size="sm"
                                onClick={() => downloadBatchImage(selectedImageForView)}
                                iconName="Download"
                                iconPosition="right"
                              >
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="mt-6 bg-muted/50 rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Format:</span>
                              <span className="ml-2 font-medium text-foreground">
                                {selectedImageForView.name.split('.').pop().toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>
                              <span className="ml-2 font-medium text-success capitalize">
                                {selectedImageForView.status}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">File Size:</span>
                              <span className="ml-2 font-medium text-foreground">
                                {formatFileSize(selectedImageForView.size)}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Processing:</span>
                              <span className="ml-2 font-medium text-foreground">
                                Background Removed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )
      }
    </div >
  );
};

export default BgRemoverTool;










// Api routes 