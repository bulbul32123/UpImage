"use client"
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FileUploadProgress from '../../components/ui/FileUploadProgress';

const FileUploadPanel = ({ onFileUpload, uploadedFiles = [], onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles?.length > 0) {
      rejectedFiles?.forEach(file => {
        console.error(`File ${file?.file?.name} rejected:`, file?.errors);
      });
    }

    // Process accepted files
    if (acceptedFiles?.length > 0) {
      const newFiles = acceptedFiles?.map(file => ({
        id: `file-${Date.now()}-${Math.random()?.toString(36)?.substr(2, 9)}`,
        name: file?.name,
        size: file?.size,
        type: file?.type,
        file: file,
        uploadedAt: new Date()
      }));

      setUploadingFiles(prev => [...prev, ...newFiles]);
      onFileUpload?.(newFiles);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const handleUploadComplete = (fileId) => {
    setUploadingFiles(prev => prev?.filter(file => file?.id !== fileId));
  };

  const handleUploadError = (fileId, error) => {
    console.error(`Upload error for file ${fileId}:`, error);
  };

  const handleUploadCancel = (fileId) => {
    setUploadingFiles(prev => prev?.filter(file => file?.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-1">PDF Files</h2>
        <p className="text-sm text-muted-foreground">Upload and manage your PDF documents</p>
      </div>
      {/* Upload Zone */}
      <div className="p-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragActive || dragActive
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isDragActive || dragActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name="Upload" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {isDragActive ? 'Drop PDF files here' : 'Drag & drop PDF files'}
              </p>
              <p className="text-xs text-muted-foreground">
                or <span className="text-primary font-medium">browse files</span>
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Supports: PDF files up to 50MB</p>
            </div>
          </div>
        </div>
      </div>
      {/* Upload Progress */}
      {uploadingFiles?.length > 0 && (
        <div className="px-4 pb-4">
          <FileUploadProgress
            files={uploadingFiles}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            onCancel={handleUploadCancel}
          />
        </div>
      )}
      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Recent Files</h3>
            <span className="text-xs text-muted-foreground">{uploadedFiles?.length} files</span>
          </div>
          
          {uploadedFiles?.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="FileText" size={24} color="var(--color-muted-foreground)" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">No PDF files uploaded</p>
              <p className="text-xs text-muted-foreground">Upload your first PDF to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {uploadedFiles?.map((file) => (
                <div
                  key={file?.id}
                  onClick={() => onFileSelect?.(file)}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="FileText" size={16} color="var(--color-error)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {file?.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file?.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file?.uploadedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {file?.processed && (
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                    )}
                    <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" iconName="FolderOpen" iconPosition="left">
            Browse
          </Button>
          <Button variant="outline" size="sm" iconName="History" iconPosition="left">
            History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadPanel;