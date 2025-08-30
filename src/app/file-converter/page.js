"use client"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FileUploadZone from '../../components/file-converter/FileUploadZone';
import FormatSelector from '../../components/file-converter/FormatSelector';
import ConversionQueue from '../../components/file-converter/ConversionQueue';
import ConversionHistory from '../../components/file-converter/ConversionHistory';

const FileConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sourceFormat, setSourceFormat] = useState('');
  const [targetFormat, setTargetFormat] = useState('');
  const [activeTab, setActiveTab] = useState('converter'); // converter, history

  const handleFilesSelected = (files) => {
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Auto-detect source format from first file if not set
    if (!sourceFormat && files?.length > 0) {
      const firstFileExtension = files?.[0]?.extension?.replace('.', '');
      setSourceFormat(firstFileExtension);
    }
  };

  const handleRemoveFile = (fileId) => {
    setSelectedFiles(prev => prev?.filter(file => file?.id !== fileId));
  };

  const handleConversionComplete = (fileId) => {
    console.log(`Conversion completed for file: ${fileId}`);
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setSourceFormat('');
    setTargetFormat('');
  };

  const tabs = [
    { id: 'converter', label: 'File Converter', icon: 'RefreshCw' },
    { id: 'history', label: 'History', icon: 'History' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <div className="bg-card border-b border-border shadow-resting">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm">
              <Link 
                to="/dashboard-overview" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
              <span className="text-foreground font-medium">File Converter</span>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="HelpCircle"
                onClick={() => window.open('/help/file-converter', '_blank')}
              >
                <span className="hidden sm:inline">Help</span>
              </Button>
              {selectedFiles?.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={handleClearAll}
                  className="text-muted-foreground hover:text-error"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
              <Icon name="RefreshCw" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-fluid-2xl font-semibold text-foreground">File Converter</h1>
              <p className="text-muted-foreground">
                Convert between multiple file formats with batch processing support
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: 'Files', title: 'Multi-format Support', desc: 'DOCX, PDF, TXT, HTML, RTF, ODT' },
              { icon: 'Layers', title: 'Batch Processing', desc: 'Convert multiple files at once' },
              { icon: 'Zap', title: 'Fast & Secure', desc: 'Quick processing with data protection' }
            ]?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={feature?.icon} size={16} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{feature?.title}</p>
                  <p className="text-xs text-muted-foreground">{feature?.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1 mb-8">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'converter' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Conversion Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: File Upload */}
              <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                    1
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Upload Files</h2>
                </div>
                <FileUploadZone
                  onFilesSelected={handleFilesSelected}
                  acceptedFormats={['.docx', '.pdf', '.txt', '.doc', '.rtf', '.odt', '.html']}
                  maxFileSize={50}
                />
              </div>

              {/* Step 2: Format Selection */}
              <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    selectedFiles?.length > 0 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    2
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Select Format</h2>
                </div>
                <FormatSelector
                  sourceFormat={sourceFormat}
                  targetFormat={targetFormat}
                  onSourceChange={setSourceFormat}
                  onTargetChange={setTargetFormat}
                  availableFormats={['docx', 'pdf', 'txt', 'doc', 'rtf', 'odt', 'html']}
                />
              </div>

              {/* Step 3: Conversion Queue */}
              {selectedFiles?.length > 0 && (
                <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      sourceFormat && targetFormat 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      3
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Process & Download</h2>
                  </div>
                  <ConversionQueue
                    files={selectedFiles}
                    sourceFormat={sourceFormat}
                    targetFormat={targetFormat}
                    onConversionComplete={handleConversionComplete}
                    onRemoveFile={handleRemoveFile}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { label: 'PDF to Word', from: 'pdf', to: 'docx', icon: 'FileText' },
                    { label: 'Word to PDF', from: 'docx', to: 'pdf', icon: 'File' },
                    { label: 'Text to PDF', from: 'txt', to: 'pdf', icon: 'FileText' },
                    { label: 'HTML to PDF', from: 'html', to: 'pdf', icon: 'Globe' }
                  ]?.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSourceFormat(action?.from);
                        setTargetFormat(action?.to);
                      }}
                      className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <Icon name={action?.icon} size={16} color="var(--color-primary)" />
                      <span className="text-sm text-foreground">{action?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Today's Usage</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Files Converted</span>
                    <span className="text-sm font-medium text-foreground">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Data Processed</span>
                    <span className="text-sm font-medium text-foreground">45.2 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Conversions Left</span>
                    <span className="text-sm font-medium text-success">88</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <Link 
                    to="/user-profile-management"
                    className="flex items-center justify-between text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>Upgrade Plan</span>
                    <Icon name="ArrowUpRight" size={14} />
                  </Link>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Lightbulb" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Pro Tip</h4>
                    <p className="text-xs text-muted-foreground">
                      For best results when converting to PDF, ensure your source documents are properly formatted with clear headings and consistent styling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* History Tab */
          (<div className="max-w-4xl">
            <ConversionHistory />
          </div>)
        )}
      </div>
    </div>
  );
};

export default FileConverter;