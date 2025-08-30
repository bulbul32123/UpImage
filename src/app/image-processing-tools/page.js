"use client"
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import ImageUploadZone from '../../components/image-processing-tools/ImageUploadZone';
import ImagePreviewArea from '../../components/image-processing-tools/ImagePreviewArea';
import ProcessingControls from '../../components/image-processing-tools/ProcessingControls';
import FileHistorySidebar from '../../components/image-processing-tools/FileHistorySidebar';
import ToolTabs from '../../components/image-processing-tools/ToolTabs';

const ImageProcessingTools = () => {
  const [activeTab, setActiveTab] = useState('background');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [processingSettings, setProcessingSettings] = useState({});

  const acceptedFormats = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    // Reset processed image when switching tabs
    setProcessedImage(null);
  }, [activeTab]);

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
    if (files?.length > 0) {
      const file = files?.[0];
      const imageUrl = URL.createObjectURL(file);
      setCurrentImage(imageUrl);
      setProcessedImage(null);
    }
  };

  const handleProcess = async (settings) => {
    if (!currentImage) return;

    setIsProcessing(true);
    setProcessingSettings(settings);

    // Simulate processing time
    const processingTime = activeTab === 'background' ? 3000 : 
                          activeTab === 'enhancement' ? 2000 :
                          activeTab === 'composition' ? 4000 : 1500;

    setTimeout(() => {
      // Mock processed image (in real app, this would be the API response)
      setProcessedImage(currentImage);
      setIsProcessing(false);
    }, processingTime);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    // Create download link
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `processed-image-${Date.now()}.png`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleFullScreen = () => {
    if (!processedImage) return;
    
    // Open in new window for full screen view
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

  const handleFileSelect = (file) => {
    setCurrentImage(file?.thumbnail);
    setProcessedImage(file?.thumbnail);
    setIsHistoryOpen(false);
  };

  const handleSettingsChange = (settings) => {
    setProcessingSettings(settings);
  };

  const getBreadcrumbItems = () => [
    { label: 'Dashboard', path: '/dashboard-overview' },
    { label: 'Image Tools', path: '/image-processing-tools' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            {getBreadcrumbItems()?.map((item, index) => (
              <React.Fragment key={item?.path}>
                {index > 0 && <Icon name="ChevronRight" size={16} />}
                {index === getBreadcrumbItems()?.length - 1 ? (
                  <span className="text-foreground font-medium">{item?.label}</span>
                ) : (
                  <Link 
                    to={item?.path}
                    className="hover:text-foreground transition-colors"
                  >
                    {item?.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-fluid-3xl font-semibold text-foreground mb-2">
                Image Processing Tools
              </h1>
              <p className="text-muted-foreground">
                Professional image editing with AI-powered background removal, enhancement, and format conversion
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                iconName="History"
                iconPosition="left"
              >
                History
              </Button>
              <Button
                variant="ghost"
                iconName="HelpCircle"
                iconPosition="left"
              >
                Help
              </Button>
            </div>
          </div>

          {/* Tool Tabs */}
          <ToolTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mt-8">
            {/* Upload and Preview Area */}
            <div className="xl:col-span-3 space-y-6">
              {/* Upload Zone */}
              {!currentImage && (
                <ImageUploadZone
                  onFilesSelected={handleFilesSelected}
                  acceptedFormats={acceptedFormats}
                  maxFileSize={maxFileSize}
                  isProcessing={isProcessing}
                />
              )}

              {/* Preview Area */}
              {currentImage && (
                <ImagePreviewArea
                  originalImage={currentImage}
                  processedImage={processedImage}
                  isProcessing={isProcessing}
                  onDownload={handleDownload}
                  onFullScreen={handleFullScreen}
                />
              )}

              {/* Upload New Image Button */}
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

            {/* Processing Controls */}
            <div className="xl:col-span-1">
              <ProcessingControls
                activeTab={activeTab}
                onProcess={handleProcess}
                isProcessing={isProcessing}
                onSettingsChange={handleSettingsChange}
              />
            </div>
          </div>

          {/* Usage Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Images Processed Today</p>
                  <p className="text-2xl font-semibold text-foreground">23</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Image" size={24} color="var(--color-accent)" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processing Credits Left</p>
                  <p className="text-2xl font-semibold text-foreground">1,247</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={24} color="var(--color-success)" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-semibold text-foreground">2.4 GB</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="HardDrive" size={24} color="var(--color-warning)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* File History Sidebar */}
      <FileHistorySidebar
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};

export default ImageProcessingTools;