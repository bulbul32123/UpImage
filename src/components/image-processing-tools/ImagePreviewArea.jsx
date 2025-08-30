"use client"
import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Image from '../../components/AppImage';

const ImagePreviewArea = ({ originalImage, processedImage, isProcessing, onDownload, onFullScreen }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showComparison, setShowComparison] = useState(true);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  if (!originalImage && !processedImage) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <Icon name="ImageOff" size={48} color="var(--color-muted-foreground)" />
          <p className="text-muted-foreground">No image selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Preview Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            iconName={showComparison ? 'Eye' : 'EyeOff'}
            iconPosition="left"
          >
            {showComparison ? 'Comparison' : 'Single View'}
          </Button>
          
          <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="h-8 w-8"
            >
              <Icon name="ZoomOut" size={16} />
            </Button>
            <span className="text-xs text-muted-foreground px-2 min-w-[3rem] text-center">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="h-8 w-8"
            >
              <Icon name="ZoomIn" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetZoom}
              className="h-8 w-8"
            >
              <Icon name="RotateCcw" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {processedImage && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onFullScreen}
                iconName="Maximize2"
                iconPosition="left"
              >
                Full Screen
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onDownload}
                iconName="Download"
                iconPosition="left"
              >
                Download
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {showComparison && originalImage && processedImage ? (
          // Comparison View
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-4 space-y-2">
              <h4 className="text-sm font-medium text-foreground">Original</h4>
              <div className="relative bg-muted rounded overflow-hidden" style={{ height: '300px' }}>
                <Image
                  src={originalImage}
                  alt="Original image"
                  className="w-full h-full object-contain transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h4 className="text-sm font-medium text-foreground">Processed</h4>
              <div className="relative bg-muted rounded overflow-hidden" style={{ height: '300px' }}>
                {isProcessing ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Processing image...</p>
                    </div>
                  </div>
                ) : processedImage ? (
                  <Image
                    src={processedImage}
                    alt="Processed image"
                    className="w-full h-full object-contain transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Icon name="Clock" size={32} color="var(--color-muted-foreground)" />
                      <p className="text-sm text-muted-foreground">Waiting for processing</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Single View
          <div className="p-4">
            <div className="relative bg-muted rounded overflow-hidden" style={{ height: '400px' }}>
              {isProcessing ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Icon name="Loader2" size={48} className="animate-spin text-primary" />
                    <p className="text-muted-foreground">Processing your image...</p>
                    <div className="w-48 bg-muted rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-primary animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={processedImage || originalImage}
                  alt={processedImage ? "Processed image" : "Original image"}
                  className="w-full h-full object-contain transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Info */}
      {(originalImage || processedImage) && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Format:</span>
              <span className="ml-2 font-medium text-foreground">PNG</span>
            </div>
            <div>
              <span className="text-muted-foreground">Size:</span>
              <span className="ml-2 font-medium text-foreground">1920 × 1080</span>
            </div>
            <div>
              <span className="text-muted-foreground">File Size:</span>
              <span className="ml-2 font-medium text-foreground">2.4 MB</span>
            </div>
            <div>
              <span className="text-muted-foreground">Quality:</span>
              <span className="ml-2 font-medium text-foreground">High</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreviewArea;