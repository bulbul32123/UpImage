"use client"
import React, { useState, useRef } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ImageUploadZone = ({ onFilesSelected, acceptedFormats, maxFileSize, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    const validFiles = files?.filter(file => {
      const isValidFormat = acceptedFormats?.includes(file?.type);
      const isValidSize = file?.size <= maxFileSize;
      return isValidFormat && isValidSize;
    });

    if (validFiles?.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    const validFiles = files?.filter(file => {
      const isValidFormat = acceptedFormats?.includes(file?.type);
      const isValidSize = file?.size <= maxFileSize;
      return isValidFormat && isValidSize;
    });

    if (validFiles?.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getAcceptedFormatsText = () => {
    const formats = acceptedFormats?.map(format => format?.split('/')?.[1]?.toUpperCase());
    return formats?.join(', ');
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : isProcessing
            ? 'border-muted bg-muted/20' :'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats?.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon 
              name={isDragOver ? 'Upload' : 'Image'} 
              size={32}
              className={isDragOver ? 'animate-bounce' : ''}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isDragOver ? 'Drop your images here' : 'Upload Images'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your images or click to browse
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleBrowseClick}
            disabled={isProcessing}
            iconName="FolderOpen"
            iconPosition="left"
            className="mt-4"
          >
            Browse Files
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported formats: {getAcceptedFormatsText()}</p>
            <p>Maximum file size: {formatFileSize(maxFileSize)}</p>
            <p>You can upload multiple images at once</p>
          </div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-card/80 rounded-lg flex items-center justify-center">
            <div className="flex items-center space-x-2 text-primary">
              <Icon name="Loader2" size={20} className="animate-spin" />
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadZone;