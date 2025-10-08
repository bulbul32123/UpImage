"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FileUploadPanel from '../../components/pdf-management-hub/FileUploadPanel';
import ChatInterface from '../../components/pdf-management-hub/ChatInterface';
import DocumentPreview from '../../components/pdf-management-hub/DocumentPreview';
import SummarizationPanel from '../../components/pdf-management-hub/SummarizationPanel';
import MobileNavigation from '../../components/pdf-management-hub/MobileNavigation';

const PDFManagementHub = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activePanel, setActivePanel] = useState('upload');
  const [chatMessages, setChatMessages] = useState([]);
  const [generatedSummaries, setGeneratedSummaries] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Mock initial files for demonstration
  useEffect(() => {
    const mockFiles = [
      {
        id: 'file-1',
        name: 'Business_Proposal_2024.pdf',
        size: 2457600, // 2.4 MB
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000), // 1 hour ago
        processed: true
      },
      {
        id: 'file-2',
        name: 'Financial_Report_Q4.pdf',
        size: 1843200, // 1.8 MB
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 7200000), // 2 hours ago
        processed: true
      },
      {
        id: 'file-3',
        name: 'Project_Documentation.pdf',
        size: 3276800, // 3.2 MB
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 86400000), // 1 day ago
        processed: false
      }
    ];
    setUploadedFiles(mockFiles);
  }, []);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFileUpload = (newFiles) => {
    const processedFiles = newFiles?.map(file => ({
      ...file,
      processed: false
    }));
    setUploadedFiles(prev => [...processedFiles, ...prev]);
    
    // Auto-select first uploaded file
    if (newFiles?.length > 0 && !selectedFile) {
      setSelectedFile(newFiles?.[0]);
      if (isMobile) {
        setActivePanel('preview');
      }
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (isMobile) {
      setActivePanel('preview');
    }
  };

  const handleSendMessage = (userMessage, assistantMessage) => {
    setChatMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const handleGenerateSummary = (summary) => {
    setGeneratedSummaries(prev => [summary, ...prev]);
  };

  const handlePanelChange = (panelId) => {
    setActivePanel(panelId);
  };

  const renderDesktopLayout = () => (
    <div className="flex h-full">
      {/* File Upload Panel - Left */}
      <div className="w-80 flex-shrink-0">
        <FileUploadPanel
          onFileUpload={handleFileUpload}
          uploadedFiles={uploadedFiles}
          onFileSelect={handleFileSelect}
        />
      </div>

      {/* Main Content Area - Center */}
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className="flex-1 min-w-0">
          <ChatInterface
            selectedFile={selectedFile}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Right Panel - Preview/Summary */}
        <div className="w-96 flex-shrink-0 flex flex-col">
          {/* Panel Tabs */}
          <div className="flex border-b border-border bg-card">
            <button
              onClick={() => setActivePanel('preview')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === 'preview' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Eye" size={16} />
                <span>Preview</span>
              </div>
            </button>
            <button
              onClick={() => setActivePanel('summary')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === 'summary' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="FileText" size={16} />
                <span>Summary</span>
                {generatedSummaries?.length > 0 && (
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                )}
              </div>
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1">
            {activePanel === 'preview' ? (
              <DocumentPreview selectedFile={selectedFile} onClose={() => setActivePanel('summary')} />
            ) : (
              <SummarizationPanel
                selectedFile={selectedFile}
                onGenerateSummary={handleGenerateSummary}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileLayout = () => (
    <div className="flex flex-col h-full pb-16">
      {/* Mobile Navigation */}
      <MobileNavigation
        activePanel={activePanel}
        onPanelChange={handlePanelChange}
        selectedFile={selectedFile}
        hasMessages={chatMessages?.length > 0}
        hasSummary={generatedSummaries?.length > 0}
      />

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {activePanel === 'upload' && (
          <FileUploadPanel
            onFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
            onFileSelect={handleFileSelect}
          />
        )}
        {activePanel === 'chat' && (
          <ChatInterface
            selectedFile={selectedFile}
            onSendMessage={handleSendMessage}
          />
        )}
        {activePanel === 'preview' && (
          <DocumentPreview selectedFile={selectedFile} onClose={() => setActivePanel('upload')} />
        )}
        {activePanel === 'summary' && (
          <SummarizationPanel
            selectedFile={selectedFile}
            onGenerateSummary={handleGenerateSummary}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-resting">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm">
              <Link 
                href="/dashboard-overview" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
              <span className="text-foreground font-medium">PDF Tools</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="HelpCircle"
                className="hidden sm:flex"
              >
                Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
                className="hidden sm:flex"
              >
                Settings
              </Button>
            </div>
          </div>

          {/* Title Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-fluid-2xl font-semibold text-foreground mb-2">
                  PDF Management Hub
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Upload, chat with, and summarize your PDF documents using AI-powered tools. 
                  Get instant insights and manage your documents efficiently.
                </p>
              </div>
              
              {/* Stats */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">{uploadedFiles?.length}</div>
                  <div className="text-xs text-muted-foreground">Files</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">{chatMessages?.length}</div>
                  <div className="text-xs text-muted-foreground">Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">{generatedSummaries?.length}</div>
                  <div className="text-xs text-muted-foreground">Summaries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1" style={{ height: 'calc(100vh - 140px)' }}>
        {isMobile ? renderMobileLayout() : renderDesktopLayout()}
      </div>
      {/* Processing Status Toast */}
      {uploadedFiles?.some(file => !file?.processed) && (
        <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg shadow-floating p-4 max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Loader2" size={16} color="var(--color-primary)" className="animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Processing Files</p>
              <p className="text-xs text-muted-foreground">
                {uploadedFiles?.filter(file => !file?.processed)?.length} files being processed...
              </p>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFManagementHub;