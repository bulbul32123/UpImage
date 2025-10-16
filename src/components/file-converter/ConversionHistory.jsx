"use client"
import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ConversionHistory = ({ className = "" }) => {
  const [historyFilter, setHistoryFilter] = useState('all'); 

  const mockHistory = [
    {
      id: 1,
      fileName: 'Annual_Report_2024.pdf',
      sourceFormat: 'pdf',
      targetFormat: 'docx',
      fileSize: '2.4 MB',
      convertedAt: new Date(Date.now() - 1000 * 60 * 30),
      downloadUrl: '#download-1',
      status: 'completed'
    },
    {
      id: 2,
      fileName: 'Meeting_Notes.txt',
      sourceFormat: 'txt',
      targetFormat: 'pdf',
      fileSize: '156 KB',
      convertedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), 
      downloadUrl: '#download-2',
      status: 'completed'
    },
    {
      id: 3,
      fileName: 'Project_Proposal.docx',
      sourceFormat: 'docx',
      targetFormat: 'pdf',
      fileSize: '1.8 MB',
      convertedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), 
      downloadUrl: '#download-3',
      status: 'completed'
    },
    {
      id: 4,
      fileName: 'Research_Data.html',
      sourceFormat: 'html',
      targetFormat: 'pdf',
      fileSize: '892 KB',
      convertedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), 
      downloadUrl: '#download-4',
      status: 'completed'
    },
    {
      id: 5,
      fileName: 'Contract_Template.rtf',
      sourceFormat: 'rtf',
      targetFormat: 'docx',
      fileSize: '445 KB',
      convertedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      downloadUrl: '#download-5',
      status: 'completed'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Time', icon: 'Calendar' },
    { value: 'today', label: 'Today', icon: 'Clock' },
    { value: 'week', label: 'This Week', icon: 'CalendarDays' },
    { value: 'month', label: 'This Month', icon: 'CalendarRange' }
  ];

  const getFilteredHistory = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    switch (historyFilter) {
      case 'today':
        return mockHistory?.filter(item => item?.convertedAt >= today);
      case 'week':
        return mockHistory?.filter(item => item?.convertedAt >= weekAgo);
      case 'month':
        return mockHistory?.filter(item => item?.convertedAt >= monthAgo);
      default:
        return mockHistory;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date?.toLocaleDateString();
  };

  const getFormatIcon = (format) => {
    const iconMap = {
      'pdf': 'FileText',
      'docx': 'FileText',
      'txt': 'File',
      'html': 'Globe',
      'rtf': 'FileText',
      'odt': 'FileText'
    };
    return iconMap?.[format] || 'File';
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Conversion History</h3>
          <p className="text-sm text-muted-foreground">
            {filteredHistory?.length} conversion{filteredHistory?.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Trash2"
          className="text-muted-foreground hover:text-error"
        >
          Clear History
        </Button>
      </div>
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        {filterOptions?.map(option => (
          <button
            key={option?.value}
            onClick={() => setHistoryFilter(option?.value)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              historyFilter === option?.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={option?.icon} size={14} />
            <span className="hidden sm:inline">{option?.label}</span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filteredHistory?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="History" size={32} color="var(--color-muted-foreground)" />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-1">No conversions found</h4>
            <p className="text-xs text-muted-foreground">
              {historyFilter === 'all' ?'Start converting files to see your history here'
                : `No conversions found for ${filterOptions?.find(f => f?.value === historyFilter)?.label?.toLowerCase()}`
              }
            </p>
          </div>
        ) : (
          filteredHistory?.map(item => (
            <div key={item?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-resting transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name={getFormatIcon(item?.sourceFormat)} size={14} />
                    </div>
                    <Icon name="ArrowRight" size={12} color="var(--color-muted-foreground)" />
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={getFormatIcon(item?.targetFormat)} size={14} color="var(--color-primary)" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item?.fileName}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{item?.sourceFormat?.toUpperCase()} → {item?.targetFormat?.toUpperCase()}</span>
                      <span>•</span>
                      <span>{item?.fileSize}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(item?.convertedAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    onClick={() => window.open(item?.downloadUrl, '_blank')}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <span className="hidden sm:inline ml-1">Download</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="MoreVertical"
                    className="text-muted-foreground hover:text-foreground"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {filteredHistory?.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Usage Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{filteredHistory?.length}</p>
              <p className="text-xs text-muted-foreground">Conversions</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {filteredHistory?.reduce((acc, item) => {
                  const size = parseFloat(item?.fileSize);
                  return acc + (item?.fileSize?.includes('MB') ? size : size / 1024);
                }, 0)?.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">MB Processed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {new Set(filteredHistory.map(item => item.sourceFormat))?.size}
              </p>
              <p className="text-xs text-muted-foreground">Source Formats</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {new Set(filteredHistory.map(item => item.targetFormat))?.size}
              </p>
              <p className="text-xs text-muted-foreground">Target Formats</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionHistory;