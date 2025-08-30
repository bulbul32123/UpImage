import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const FileUploadProgress = ({ 
  files = [], 
  onUploadComplete, 
  onUploadError, 
  onCancel,
  className = "" 
}) => {
  const [uploadStates, setUploadStates] = useState({});

  useEffect(() => {
    if (files?.length > 0) {
      // Initialize upload states for new files
      const newStates = {};
      files?.forEach(file => {
        if (!uploadStates?.[file?.id]) {
          newStates[file.id] = {
            progress: 0,
            status: 'uploading', // uploading, processing, completed, error
            error: null
          };
        }
      });
      
      if (Object.keys(newStates)?.length > 0) {
        setUploadStates(prev => ({ ...prev, ...newStates }));
        
        // Simulate upload progress for each file
        files?.forEach(file => {
          if (!uploadStates?.[file?.id]) {
            simulateUpload(file?.id);
          }
        });
      }
    }
  }, [files]);

  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadStates(prev => ({
          ...prev,
          [fileId]: { ...prev?.[fileId], progress: 100, status: 'processing' }
        }));
        
        // Simulate processing phase
        setTimeout(() => {
          const success = Math.random() > 0.1; // 90% success rate
          
          if (success) {
            setUploadStates(prev => ({
              ...prev,
              [fileId]: { ...prev?.[fileId], status: 'completed' }
            }));
            onUploadComplete?.(fileId);
          } else {
            setUploadStates(prev => ({
              ...prev,
              [fileId]: { 
                ...prev?.[fileId], 
                status: 'error',
                error: 'Upload failed. Please try again.'
              }
            }));
            onUploadError?.(fileId, 'Upload failed. Please try again.');
          }
        }, 1500);
      } else {
        setUploadStates(prev => ({
          ...prev,
          [fileId]: { ...prev?.[fileId], progress }
        }));
      }
    }, 200);
  };

  const handleRetry = (fileId) => {
    setUploadStates(prev => ({
      ...prev,
      [fileId]: { progress: 0, status: 'uploading', error: null }
    }));
    simulateUpload(fileId);
  };

  const handleCancel = (fileId) => {
    setUploadStates(prev => {
      const newStates = { ...prev };
      delete newStates?.[fileId];
      return newStates;
    });
    onCancel?.(fileId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Icon name="Upload" size={16} className="animate-pulse" />;
      case 'processing':
        return <Icon name="Loader2" size={16} className="animate-spin" />;
      case 'completed':
        return <Icon name="CheckCircle" size={16} color="var(--color-success)" />;
      case 'error':
        return <Icon name="AlertCircle" size={16} color="var(--color-error)" />;
      default:
        return <Icon name="File" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploading':
        return 'bg-primary';
      case 'processing':
        return 'bg-warning';
      case 'completed':
        return 'bg-success';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = (status, progress) => {
    switch (status) {
      case 'uploading':
        return `Uploading... ${Math.round(progress)}%`;
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  if (files?.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {files?.map(file => {
        const state = uploadStates?.[file?.id] || { progress: 0, status: 'pending', error: null };
        
        return (
          <div key={file?.id} className="bg-card border border-border rounded-lg p-4 shadow-resting">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getStatusIcon(state?.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file?.size / 1024 / 1024)?.toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                {state?.status === 'error' && (
                  <button
                    onClick={() => handleRetry(file?.id)}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Retry
                  </button>
                )}
                {(state?.status === 'uploading' || state?.status === 'error') && (
                  <button
                    onClick={() => handleCancel(file?.id)}
                    className="text-xs text-muted-foreground hover:text-error transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  {getStatusText(state?.status, state?.progress)}
                </span>
                {state?.status === 'uploading' && (
                  <span className="text-xs text-muted-foreground">
                    {Math.round(state?.progress)}%
                  </span>
                )}
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-out ${getStatusColor(state?.status)}`}
                  style={{
                    width: state?.status === 'completed' ? '100%' : 
                           state?.status === 'processing' ? '100%' :
                           state?.status === 'error' ? '100%' :
                           `${state?.progress}%`
                  }}
                >
                  {state?.status === 'processing' && (
                    <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
            {/* Error Message */}
            {state?.status === 'error' && state?.error && (
              <div className="flex items-start space-x-2 p-2 bg-error/10 border border-error/20 rounded text-xs text-error">
                <Icon name="AlertTriangle" size={12} className="flex-shrink-0 mt-0.5" />
                <span>{state?.error}</span>
              </div>
            )}
            {/* Success Message */}
            {state?.status === 'completed' && (
              <div className="flex items-center space-x-2 text-xs text-success">
                <Icon name="CheckCircle" size={12} />
                <span>File processed successfully</span>
              </div>
            )}
          </div>
        );
      })}
      {/* Overall Progress Summary */}
      {files?.length > 1 && (
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Processing {files?.length} files
            </span>
            <span className="text-foreground font-medium">
              {Object.values(uploadStates)?.filter(state => state?.status === 'completed')?.length} / {files?.length} completed
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadProgress;