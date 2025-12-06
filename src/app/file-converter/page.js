"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '../../components/AppIcon';
import FileUploadZone from '../../components/file-converter/FileUploadZone';
import ConversionQueue from '../../components/file-converter/ConversionQueue';
import ConversionHistory from '../../components/file-converter/ConversionHistory';

const FileConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sourceFormat, setSourceFormat] = useState('');
  const [targetFormat, setTargetFormat] = useState('');
  const [activeTab, setActiveTab] = useState('converter');
  const [showAddQuickAction, setShowAddQuickAction] = useState(false);
  const [customQuickActions, setCustomQuickActions] = useState([]);
  const [newQuickAction, setNewQuickAction] = useState({
    label: '',
    from: '',
    to: '',
    icon: 'File'
  });

  const defaultQuickActions = [
    { label: 'PNG to JPG', from: 'png', to: 'jpg', icon: 'File' },
    { label: 'JPG to PNG', from: 'jpg', to: 'png', icon: 'File' },
    { label: 'PNG to WEBP', from: 'png', to: 'webp', icon: 'File' },
    { label: 'PNG to JPEG', from: 'png', to: 'jpeg', icon: 'File' },
    { label: 'JPG to WEBP', from: 'jpg', to: 'webp', icon: 'File' }
  ];
  useEffect(() => {
    const saved = localStorage.getItem('customQuickActions');
    if (saved) {
      setCustomQuickActions(JSON.parse(saved));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('customQuickActions', JSON.stringify(customQuickActions));
  }, [customQuickActions]);

  const handleFilesSelected = (files) => {
    setSelectedFiles(prev => [...prev, ...files]);

    if (!sourceFormat && files?.length > 0) {
      const firstFileExtension = files?.[0]?.extension?.replace('.', '');
      setSourceFormat(firstFileExtension);
    }
  };
  const handleRemoveFile = (fileId) => {
    setSelectedFiles(prev => prev?.filter(file => file?.id !== fileId));
  };
  const handleQuickActionClick = (action) => {
    if (selectedFiles.length === 0) {
      alert('Please upload files first before selecting a quick action.');
      return;
    }
    const matchingFiles = selectedFiles.filter(file => {
      const fileExtension = file.extension?.replace('.', '').toLowerCase();
      return fileExtension === action.from.toLowerCase();
    });
    if (matchingFiles.length === 0) {
      alert(`No ${action.from.toUpperCase()} files found. This quick action converts ${action.from.toUpperCase()} to ${action.to.toUpperCase()}.`);
      return;
    }
    setSourceFormat(action.from);
    setTargetFormat(action.to);
    const message = matchingFiles.length === 1
      ? `Applied ${action.label} conversion to 1 matching file.`
      : `Applied ${action.label} conversion to ${matchingFiles.length} matching files.`;
    setTimeout(() => {
      alert(message);
    }, 100);
  };
  const handleAddQuickAction = () => {
    if (!newQuickAction.label || !newQuickAction.from || !newQuickAction.to) {
      alert('Please fill in all fields.');
      return;
    }
    if (newQuickAction.from === newQuickAction.to) {
      alert('Source and target formats must be different.');
      return;
    }
    const allActions = [...defaultQuickActions, ...customQuickActions];
    const isDuplicate = allActions.some(action =>
      action.from === newQuickAction.from && action.to === newQuickAction.to
    );

    if (isDuplicate) {
      alert('This conversion already exists in your quick actions.');
      return;
    }
    setCustomQuickActions(prev => [...prev, { ...newQuickAction }]);
    setNewQuickAction({ label: '', from: '', to: '', icon: 'File' });
    setShowAddQuickAction(false);
  };

  const handleDeleteCustomAction = (index) => {
    setCustomQuickActions(prev => prev.filter((_, i) => i !== index));
  };

  const getFileCountByFormat = (format) => {
    return selectedFiles.filter(file => {
      const fileExtension = file.extension?.replace('.', '').toLowerCase();
      return fileExtension === format.toLowerCase();
    }).length;
  };

  const tabs = [
    { id: 'converter', label: 'File Converter', icon: 'RefreshCw' },
    { id: 'history', label: 'History', icon: 'History' }
  ];

  const formatOptions = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'avif', 'tiff'];
  const allQuickActions = [...defaultQuickActions, ...customQuickActions];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border shadow-resting">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href="/dashboard-overview"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
              <span className="text-foreground font-medium">File Converter</span>
            </nav>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>

        <div className="flex space-x-1 bg-muted rounded-lg p-1 mb-8">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab?.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'converter' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Upload Files</h2>
                </div>
                <FileUploadZone
                  onFilesSelected={handleFilesSelected}
                  acceptedFormats={['.txt', ".webp", "jpeg", '.png', ".jpg", ".svg", ".avif", ".tiff"]}
                  maxFileSize={50}
                />
              </div>

              {selectedFiles?.length > 0 && (
                <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${sourceFormat && targetFormat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                      }`}>
                      2
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Process & Download</h2>
                  </div>
                  <ConversionQueue
                    files={selectedFiles}
                    sourceFormat={sourceFormat}
                    onRemoveFile={handleRemoveFile}
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
                  <button
                    onClick={() => setShowAddQuickAction(!showAddQuickAction)}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Icon name="Plus" size={12} />
                    <span>Add</span>
                  </button>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Uploaded file formats:</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(selectedFiles.map(file => file.extension?.replace('.', '').toLowerCase()))].map(format => (
                        <span key={format} className="px-2 py-1 bg-card border rounded text-xs">
                          {format?.toUpperCase()} ({getFileCountByFormat(format)})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {showAddQuickAction && (
                  <div className="mb-4 p-4 border border-border rounded-lg bg-muted/20">
                    <h4 className="text-sm font-medium mb-3">Create Custom Quick Action</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Action label (e.g., 'PNG to JPG')"
                        value={newQuickAction.label}
                        onChange={(e) => setNewQuickAction(prev => ({ ...prev, label: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newQuickAction.from}
                          onChange={(e) => setNewQuickAction(prev => ({ ...prev, from: e.target.value }))}
                          className="px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">From format</option>
                          {formatOptions.map(format => (
                            <option key={format} value={format}>{format.toUpperCase()}</option>
                          ))}
                        </select>
                        <select
                          value={newQuickAction.to}
                          onChange={(e) => setNewQuickAction(prev => ({ ...prev, to: e.target.value }))}
                          className="px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">To format</option>
                          {formatOptions.map(format => (
                            <option key={format} value={format}>{format.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleAddQuickAction}
                          className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                          Add Action
                        </button>
                        <button
                          onClick={() => setShowAddQuickAction(false)}
                          className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allQuickActions.map((action, index) => {
                    const isCustom = index >= defaultQuickActions.length;
                    const matchingFiles = getFileCountByFormat(action.from);
                    const isDisabled = selectedFiles.length === 0 || matchingFiles === 0;

                    return (
                      <div key={index} className="flex items-center justify-between group">
                        <button
                          onClick={() => handleQuickActionClick(action)}
                          disabled={isDisabled}
                          className={`flex items-center space-x-3 flex-1 p-3 rounded-lg text-left transition-colors ${isDisabled
                              ? 'opacity-50 cursor-not-allowed bg-muted/50'
                              : 'hover:bg-muted'
                            }`}
                        >
                          <Icon name={action?.icon} size={16} color="var(--color-primary)" />
                          <div className="flex-1">
                            <span className="text-sm text-foreground">{action?.label}</span>
                            {selectedFiles.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {matchingFiles > 0
                                  ? `${matchingFiles} matching file${matchingFiles !== 1 ? 's' : ''}`
                                  : 'No matching files'
                                }
                              </div>
                            )}
                          </div>
                        </button>
                        {isCustom && (
                          <button
                            onClick={() => handleDeleteCustomAction(index - defaultQuickActions.length)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-error hover:bg-error/10 rounded transition-all"
                          >
                            <Icon name="Trash2" size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

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
                    href="/user-profile-management"
                    className="flex items-center justify-between text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>Upgrade Plan</span>
                    <Icon name="ArrowUpRight" size={14} />
                  </Link>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Lightbulb" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Pro Tip</h4>
                    <p className="text-xs text-muted-foreground">
                      Quick actions will only work with files that match the source format. Upload your files first, then use quick actions for instant conversion setup.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          (<div className="max-w-4xl">
            <ConversionHistory />
          </div>)
        )}
      </div>
    </div>
  );
};

export default FileConverter

// { label: 'PNG to JPG', from: 'png', to: 'jpg', icon: 'File' },
// { label: 'PNG to JPEG', from: 'png', to: 'jpeg', icon: 'File' },
// { label: 'PNG to WEBP', from: 'png', to: 'webp', icon: 'File' },

// { label: 'JPG to PNG', from: 'jpg', to: 'png', icon: 'File' },
// { label: 'JPG to WEBP', from: 'jpg', to: 'webp', icon: 'File' },
// { label: 'JPG to JPEG', from: 'jpg', to: 'jpeg', icon: 'File' },

// { label: 'JPEG to JPG', from: 'jpeg', to: 'jpg', icon: 'File' },
// { label: 'JPEG to WEBP', from: 'jpeg', to: 'webp', icon: 'File' },
// { label: 'JPEG to PNG', from: 'jpeg', to: 'png', icon: 'File' },

// { label: 'WEBP to JPEG', from: 'webp', to: 'jpeg', icon: 'File' },
// { label: 'WEBP to PNG', from: 'webp', to: 'png', icon: 'File' },
// { label: 'WEBP to JPG', from: 'webp', to: 'jpg', icon: 'File' },







{/* <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${selectedFiles?.length > 0
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                    }`}>
                    1
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
              </div> */}