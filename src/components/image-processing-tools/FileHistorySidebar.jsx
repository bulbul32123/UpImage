"use client"
import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Image from '../../components/AppImage';

const FileHistorySidebar = ({ isOpen, onToggle, onFileSelect }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const recentFiles = [
    {
      id: 1,
      name: 'product-photo-1.jpg',
      type: 'background',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
      processedAt: '2 hours ago',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      id: 2,
      name: 'portrait-enhanced.png',
      type: 'enhancement',
      thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop',
      processedAt: '5 hours ago',
      size: '3.1 MB',
      status: 'completed'
    },
    {
      id: 3,
      name: 'logo-composition.png',
      type: 'composition',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=150&fit=crop',
      processedAt: '1 day ago',
      size: '1.8 MB',
      status: 'completed'
    },
    {
      id: 4,
      name: 'banner-converted.webp',
      type: 'conversion',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop',
      processedAt: '2 days ago',
      size: '892 KB',
      status: 'completed'
    },
    {
      id: 5,
      name: 'team-photo.jpg',
      type: 'background',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop',
      processedAt: '3 days ago',
      size: '4.2 MB',
      status: 'completed'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Files', icon: 'Files' },
    { value: 'background', label: 'Background Removal', icon: 'Scissors' },
    { value: 'enhancement', label: 'Enhanced', icon: 'Sparkles' },
    { value: 'composition', label: 'Composition', icon: 'Layers' },
    { value: 'conversion', label: 'Converted', icon: 'RefreshCw' }
  ];

  const filteredFiles = selectedFilter === 'all' 
    ? recentFiles 
    : recentFiles?.filter(file => file?.type === selectedFilter);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'background':
        return 'Scissors';
      case 'enhancement':
        return 'Sparkles';
      case 'composition':
        return 'Layers';
      case 'conversion':
        return 'RefreshCw';
      default:
        return 'Image';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'background':
        return 'text-accent';
      case 'enhancement':
        return 'text-success';
      case 'composition':
        return 'text-warning';
      case 'conversion':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleDownload = (file, e) => {
    e?.stopPropagation();
    console.log('Downloading file:', file?.name);
  };

  const handleDelete = (file, e) => {
    e?.stopPropagation();
    console.log('Deleting file:', file?.name);
  };

  if (!isOpen) {
    return (
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="rounded-full shadow-floating bg-card"
        >
          <Icon name="History" size={20} />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={onToggle}
      />
      <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-floating z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">File History</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="space-y-1">
            {filterOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setSelectedFilter(option?.value)}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedFilter === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={option?.icon} size={16} />
                <span>{option?.label}</span>
                <span className="ml-auto text-xs">
                  {option?.value === 'all' 
                    ? recentFiles?.length 
                    : recentFiles?.filter(f => f?.type === option?.value)?.length
                  }
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredFiles?.length > 0 ? (
            <div className="p-4 space-y-3">
              {filteredFiles?.map((file) => (
                <div
                  key={file?.id}
                  onClick={() => onFileSelect?.(file)}
                  className="group bg-muted/50 rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={file?.thumbnail}
                          alt={file?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center ${getTypeColor(file?.type)}`}>
                        <Icon name={getTypeIcon(file?.type)} size={10} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file?.processedAt} • {file?.size}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-xs text-success">Completed</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDownload(file, e)}
                            className="h-6 w-6"
                          >
                            <Icon name="Download" size={12} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDelete(file, e)}
                            className="h-6 w-6 text-error hover:text-error"
                          >
                            <Icon name="Trash2" size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <Icon name="FileX" size={48} color="var(--color-muted-foreground)" />
                <p className="text-muted-foreground">No files found</p>
                <p className="text-xs text-muted-foreground">
                  Process some images to see them here
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{filteredFiles?.length} files</span>
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              className="text-error hover:text-error"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileHistorySidebar;