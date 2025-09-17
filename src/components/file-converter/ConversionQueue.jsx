"use client"
import React, { useState, useEffect } from 'react';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ConversionQueue = ({
  files,
  onRemoveFile,
  sourceFormat,
  className = ""
}) => {
  const [conversionStates, setConversionStates] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize conversion states for new files
    const newStates = {};
    files?.forEach(file => {
      if (!conversionStates?.[file?.id]) {
        newStates[file.id] = {
          status: 'pending',
          progress: 0,
          error: null,
          estimatedTime: null,
          downloadUrl: null,
          targetFormat: 'png' // Default target format for each file
        };
      }
    });

    if (Object.keys(newStates)?.length > 0) {
      setConversionStates(prev => ({ ...prev, ...newStates }));
    }
  }, [files]);

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    for (const file of completedFiles) {
      const state = conversionStates[file.id];
      if (state?.downloadUrl) {
        const response = await fetch(state.downloadUrl);
        const blob = await response.blob();

        const baseName = file?.name.replace(/\.[^/.]+$/, "");
        const targetFormat = state.targetFormat;
        zip.file(`${baseName}-bytoolsuitepro.${targetFormat}`, blob);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "converted-files.zip");
  };

  const convertFile = async (fileId, fileObj) => {
    const state = conversionStates[fileId];
    const selectedFormat = state?.targetFormat;

    if (!selectedFormat) {
      console.error('No target format selected for file:', fileId);
      return;
    }

    const updateState = (updates) => {
      setConversionStates((prev) => ({
        ...prev,
        [fileId]: { ...prev?.[fileId], ...updates },
      }));
    };

    try {
      updateState({ status: "converting", progress: 0 });

      const formData = new FormData();
      formData.append("file", fileObj.file);
      formData.append("targetFormat", selectedFormat);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Conversion failed");

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);

      updateState({
        status: "completed",
        progress: 100,
        downloadUrl,
      });
    } catch (error) {
      updateState({
        status: "error",
        error: error.message || "Conversion failed",
      });
    }
  };

  const handleStartConversion = async () => {
    if (!sourceFormat) return;

    // Check if all files have target formats selected
    const filesWithoutFormat = files.filter(file =>
      !conversionStates[file.id]?.targetFormat
    );

    if (filesWithoutFormat.length > 0) {
      alert('Please select target formats for all files before starting conversion.');
      return;
    }

    setIsProcessing(true);

    // Process files sequentially
    for (const file of files) {
      if (conversionStates?.[file?.id]?.status === "pending") {
        await convertFile(file.id, file);
      }
    }

    setIsProcessing(false);
  };

  const handleRetryConversion = (fileId) => {
    convertFile(fileId, files.find(f => f.id === fileId));
  };

  const handleFormatChange = (fileId, newFormat) => {
    setConversionStates(prev => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        targetFormat: newFormat
      }
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />;
      case 'converting':
        return <Icon name="Loader2" size={16} color="var(--color-primary)" className="animate-spin" />;
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
      case 'converting':
        return 'bg-primary';
      case 'completed':
        return 'bg-success';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  if (files?.length === 0) return null;

  const completedFiles = files?.filter(file => conversionStates?.[file?.id]?.status === 'completed');
  const canStartConversion = sourceFormat && files.every(file =>
    conversionStates[file.id]?.targetFormat
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Queue Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Conversion Queue</h3>
          <p className='mb-4 text-xs'>Select target format for each file individually or use quick actions</p>
          <p className="text-sm text-muted-foreground">
            {files?.length} file{files?.length !== 1 ? 's' : ''} ready for conversion
            {files.length > 0 &&
              files.every(file => conversionStates[file.id]?.targetFormat === conversionStates[files[0].id]?.targetFormat) && (
                <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                  Quick Action: Converting to {conversionStates[files[0].id]?.targetFormat?.toUpperCase()}
                </span>
              )}
          </p>

        </div>

        {files?.length > 0 && (
          <Button
            variant="default"
            onClick={handleStartConversion}
            disabled={!canStartConversion}
            loading={isProcessing}
            iconName="Play"
            iconPosition="left"
          >
            {isProcessing ? 'Converting...' : 'Start Conversion'}
          </Button>
        )}
      </div>

      {/* File Queue */}
      <div className="space-y-3">
        {files?.map(file => {
          const state = conversionStates?.[file?.id] || {
            status: 'pending',
            progress: 0,
            targetFormat: 'png'
          };

          return (
            <div key={file?.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="flex-shrink-0">
                    {getStatusIcon(state?.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file?.size)} • {file?.extension?.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Format conversion display */}
                {sourceFormat && state.targetFormat && (
                  <div className="bg-card border border-border rounded-lg p-2 mx-4">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-xs text-foreground">
                            {sourceFormat?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <Icon name="ArrowRight" size={20} color="var(--color-primary)" />
                      <div className="flex items-center space-x-3">
                        <div className="w-full p-1 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">
                            {state.targetFormat?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Individual format selector */}
                <select
                  value={state.targetFormat || ''}
                  onChange={(e) => handleFormatChange(file.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm mr-2"
                  disabled={state.status === 'converting'}
                >
                  <option value="">Select format</option>
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WEBP</option>
                </select>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {state?.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Download"
                      onClick={() => {
                        const baseName = file?.name.replace(/\.[^/.]+$/, "");
                        const link = document.createElement("a");
                        link.href = state.downloadUrl;
                        link.download = `${baseName}-bytoolsuitepro.${state.targetFormat}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download
                    </Button>
                  )}
                  {state?.status === 'error' && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="RotateCcw"
                      onClick={() => handleRetryConversion(file?.id)}
                    >
                      Retry
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFile(file?.id)}
                    className="text-muted-foreground hover:text-error"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {(state?.status === 'converting' || state?.status === 'completed') && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      {state?.status === 'converting' ? 'Converting...' : 'Completed'}
                    </span>
                    {state?.status === 'converting' && state?.estimatedTime && (
                      <span className="text-xs text-muted-foreground">
                        ~{formatTime(state?.estimatedTime)} remaining
                      </span>
                    )}
                  </div>

                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ease-out ${getStatusColor(state?.status)}`}
                      style={{ width: `${state?.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {state?.status === 'error' && state?.error && (
                <div className="flex items-start space-x-2 p-2 bg-error/10 border border-error/20 rounded text-xs text-error">
                  <Icon name="AlertTriangle" size={12} className="flex-shrink-0 mt-0.5" />
                  <span>{state?.error}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Batch Download */}
      {completedFiles?.length > 1 && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Package" size={16} color="var(--color-success)" />
              <span className="text-sm font-medium text-success">
                {completedFiles?.length} files converted successfully
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={handleDownloadAll}
              className="border-success text-success hover:bg-success hover:text-success-foreground"
            >
              Download All (ZIP)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionQueue;