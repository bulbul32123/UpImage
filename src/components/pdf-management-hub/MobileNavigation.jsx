"use client"
import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MobileNavigation = ({ activePanel, onPanelChange, selectedFile, hasMessages, hasSummary }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const panels = [
    {
      id: 'upload',
      label: 'Files',
      icon: 'FolderOpen',
      badge: null
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: 'MessageCircle',
      badge: hasMessages ? 'active' : null,
      disabled: !selectedFile
    },
    {
      id: 'preview',
      label: 'Preview',
      icon: 'Eye',
      badge: null,
      disabled: !selectedFile
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: 'FileText',
      badge: hasSummary ? 'new' : null,
      disabled: !selectedFile
    }
  ];

  const handlePanelSelect = (panelId) => {
    onPanelChange(panelId);
    setIsExpanded(false);
  };

  const currentPanel = panels?.find(panel => panel?.id === activePanel);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-floating">
        <div className="flex items-center justify-around p-2">
          {panels?.map((panel) => (
            <button
              key={panel?.id}
              onClick={() => handlePanelSelect(panel?.id)}
              disabled={panel?.disabled}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors relative ${
                activePanel === panel?.id
                  ? 'bg-primary text-primary-foreground'
                  : panel?.disabled
                  ? 'text-muted-foreground/50 cursor-not-allowed'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon 
                name={panel?.icon} 
                size={20} 
                color={activePanel === panel?.id ? 'white' : 'currentColor'}
              />
              <span className="text-xs font-medium">{panel?.label}</span>
              
              {/* Badge */}
              {panel?.badge && (
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                  panel?.badge === 'active' ? 'bg-success' : 
                  panel?.badge === 'new' ? 'bg-warning' : 'bg-primary'
                }`}>
                  {panel?.badge === 'new' && (
                    <div className="w-full h-full bg-warning rounded-full animate-pulse"></div>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Mobile Panel Header */}
      <div className="lg:hidden bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              activePanel === 'upload' ? 'bg-accent' :
              activePanel === 'chat' ? 'bg-primary' :
              activePanel === 'preview'? 'bg-secondary' : 'bg-success'
            }`}>
              <Icon 
                name={currentPanel?.icon || 'FileText'} 
                size={16} 
                color="white" 
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {currentPanel?.label || 'PDF Tools'}
              </h1>
              {selectedFile && (
                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {selectedFile?.name}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {selectedFile && (
              <>
                {activePanel === 'chat' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RotateCcw"
                    className="text-xs"
                  >
                    Clear
                  </Button>
                )}
                {activePanel === 'summary' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    className="text-xs"
                  >
                    Export
                  </Button>
                )}
                {activePanel === 'preview' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Maximize2"
                    className="text-xs"
                  >
                    Fullscreen
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-3">
          <div className="flex items-center space-x-1">
            {panels?.map((panel, index) => (
              <div
                key={panel?.id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  activePanel === panel?.id
                    ? 'bg-primary'
                    : panel?.disabled
                    ? 'bg-muted/50' :'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Swipe Indicator */}
      {selectedFile && (
        <div className="lg:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            Swipe to navigate panels
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;