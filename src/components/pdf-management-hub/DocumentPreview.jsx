"use client"
import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DocumentPreview = ({ selectedFile, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalPages = 12;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageInput = (e) => {
    const page = parseInt(e?.target?.value);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center bg-card border-l border-border">
        <div className="text-center max-w-sm p-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={24} color="var(--color-muted-foreground)" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Document Selected</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select a PDF file from the left panel to preview it here.
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="ZoomIn" size={12} />
              <span>Zoom</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="RotateCw" size={12} />
              <span>Rotate</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Download" size={12} />
              <span>Download</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-card ${isFullscreen ? 'fixed inset-0 z-50' : 'border-l border-border'}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-error/10 rounded flex items-center justify-center">
              <Icon name="FileText" size={16} color="var(--color-error)" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground truncate">
                {selectedFile?.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {(selectedFile?.size / 1024 / 1024)?.toFixed(2)} MB • {totalPages} pages
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="w-8 h-8"
            >
              <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={14} />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="w-8 h-8"
              >
                <Icon name="X" size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
            />
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={currentPage}
                onChange={handlePageInput}
                min="1"
                max={totalPages}
                className="w-12 px-2 py-1 text-xs text-center border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">of {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel === 50}
              iconName="ZoomOut"
            />
            <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
              {zoomLevel}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel === 200}
              iconName="ZoomIn"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetZoom}
              className="text-xs"
            >
              Reset
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" iconName="RotateCw" />
            <Button variant="outline" size="sm" iconName="Download" />
            <Button variant="outline" size="sm" iconName="Share" />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-muted/30 p-4">
        <div className="flex justify-center">
          <div 
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-200"
            style={{ 
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center'
            }}
          >
            <div className="w-[595px] h-[842px] relative">
              <div className="absolute inset-0 p-8 text-gray-800 text-sm leading-relaxed">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">Business Proposal</h1>
                  <p className="text-gray-600">AI-Powered Customer Service Implementation</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Executive Summary</h2>
                    <p className="text-justify">
                      This proposal outlines the implementation of an AI-powered customer service solution 
                      designed to enhance customer satisfaction while reducing operational costs. The proposed 
                      system will integrate seamlessly with existing infrastructure and provide 24/7 support 
                      capabilities.
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Current Challenges</h2>
                    <ul className="list-disc list-inside space-y-1">
                      <li>High volume of repetitive customer inquiries</li>
                      <li>Limited support hours affecting customer satisfaction</li>
                      <li>Increasing operational costs for customer service staff</li>
                      <li>Inconsistent response quality across different agents</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Proposed Solution</h2>
                    <p className="text-justify">
                      Implementation of an advanced AI chatbot system that can handle 80% of common 
                      customer inquiries automatically, with seamless escalation to human agents 
                      for complex issues.
                    </p>
                  </div>
                </div>
                
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-xs text-gray-500">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span>Confidential Business Document</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Page {currentPage} of {totalPages}</span>
            <span>Zoom: {zoomLevel}%</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Document loaded</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Last modified: Dec 15, 2024</span>
            <span>Size: {(selectedFile?.size / 1024 / 1024)?.toFixed(2)} MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;