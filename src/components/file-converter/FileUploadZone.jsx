"use client"
import React, { useState, useRef } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const FileUploadZone = ({ onFilesSelected, acceptedFormats, maxFileSize, className = "" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const supportedFormats = acceptedFormats || ['.docx', '.pdf', '.txt', '.doc', '.rtf', '.odt'];
  const maxSize = maxFileSize || 50; // MB

  const validateFile = (file) => {
    const fileExtension = '.' + file?.name?.split('.')?.pop()?.toLowerCase();
    
    if (!supportedFormats?.includes(fileExtension)) {
      return `Unsupported format. Supported: ${supportedFormats?.join(', ')}`;
    }
    
    if (file?.size > maxSize * 1024 * 1024) {
      return `File too large. Maximum size: ${maxSize}MB`;
    }
    
    return null;
  };

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
    setUploadError('');
    
    const files = Array.from(e?.dataTransfer?.files);
    processFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const validFiles = [];
    const errors = [];

    files?.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors?.push(`${file?.name}: ${error}`);
      } else {
        validFiles?.push({
          id: Date.now() + Math.random(),
          file,
          name: file?.name,
          size: file?.size,
          type: file?.type,
          extension: '.' + file?.name?.split('.')?.pop()?.toLowerCase()
        });
      }
    });

    if (errors?.length > 0) {
      setUploadError(errors?.join('\n'));
    }

    if (validFiles?.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={supportedFormats?.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name="Upload" size={32} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isDragOver ? 'Drop files here' : 'Upload files to convert'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your files here, or click to browse
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleBrowseClick}
            iconName="FolderOpen"
            iconPosition="left"
            className="mx-auto"
          >
            Browse Files
          </Button>
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
            <div className="text-primary font-medium">Drop to upload</div>
          </div>
        )}
      </div>
      {/* Format Information */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Supported Formats</h4>
            <div className="flex flex-wrap gap-1">
              {supportedFormats?.map(format => (
                <span
                  key={format}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-foreground"
                >
                  {format?.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">File Limits</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Maximum file size: {maxSize}MB</p>
              <p>Multiple files supported</p>
              <p>Batch processing available</p>
            </div>
          </div>
        </div>
      </div>
      {/* Error Display */}
      {uploadError && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-error mb-1">Upload Error</h4>
              <pre className="text-xs text-error whitespace-pre-wrap">{uploadError}</pre>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setUploadError('')}
              className="text-error hover:bg-error/10"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;