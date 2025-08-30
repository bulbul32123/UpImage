import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const DashboardToolCards = () => {
  const toolCards = [
    {
      title: 'Image Processing Tools',
      description: 'Background removal, enhancement, composition, and format conversion',
      path: '/image-processing-tools',
      icon: 'Image',
      color: 'bg-accent',
      stats: {
        processed: '1,234',
        label: 'Images Processed'
      },
      features: ['Background Removal', 'Image Enhancement', 'Format Conversion', 'Batch Processing']
    },
    {
      title: 'PDF Management Hub',
      description: 'Chat with PDFs, summarization, and comprehensive file management',
      path: '/pdf-management-hub',
      icon: 'FileText',
      color: 'bg-primary',
      stats: {
        processed: '567',
        label: 'PDFs Managed'
      },
      features: ['PDF Chat', 'Document Summary', 'File Organization', 'Text Extraction']
    },
    {
      title: 'File Converter',
      description: 'Multi-format conversion supporting DOCX, PDF, TXT with batch processing',
      path: '/file-converter',
      icon: 'RefreshCw',
      color: 'bg-success',
      stats: {
        processed: '890',
        label: 'Files Converted'
      },
      features: ['Multi-format Support', 'Batch Conversion', 'Quality Preservation', 'Fast Processing']
    }
  ];

  const recentActivity = [
    {
      action: 'Converted 5 DOCX files to PDF',
      time: '2 minutes ago',
      icon: 'RefreshCw'
    },
    {
      action: 'Processed image background removal',
      time: '15 minutes ago',
      icon: 'Image'
    },
    {
      action: 'Generated PDF summary report',
      time: '1 hour ago',
      icon: 'FileText'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-fluid-2xl font-semibold text-foreground mb-2">
              Welcome back, John!
            </h1>
            <p className="text-muted-foreground">
              Ready to process your files? Choose a tool below to get started.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Zap" size={32} color="var(--color-primary)" />
            </div>
          </div>
        </div>
      </div>
      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolCards?.map((tool) => (
          <Link
            key={tool?.path}
            to={tool?.path}
            className="group bg-card rounded-lg p-6 shadow-resting border border-border hover:shadow-elevated transition-all duration-150 hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${tool?.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-150`}>
                <Icon name={tool?.icon} size={24} color="white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-foreground">{tool?.stats?.processed}</p>
                <p className="text-xs text-muted-foreground">{tool?.stats?.label}</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {tool?.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {tool?.description}
            </p>

            <div className="space-y-2">
              {tool?.features?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span className="text-xs text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary group-hover:text-primary/80">
                  Open Tool
                </span>
                <Icon 
                  name="ArrowRight" 
                  size={16} 
                  color="var(--color-primary)"
                  className="group-hover:translate-x-1 transition-transform duration-150"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <Link 
              to="/activity" 
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name={activity?.icon} size={14} color="var(--color-muted-foreground)" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity?.action}</p>
                  <p className="text-xs text-muted-foreground">{activity?.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Usage Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-sm text-foreground">Files Processed Today</span>
              </div>
              <span className="text-sm font-medium text-foreground">23</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-foreground">Storage Used</span>
              </div>
              <span className="text-sm font-medium text-foreground">2.4 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-sm text-foreground">API Calls Remaining</span>
              </div>
              <span className="text-sm font-medium text-foreground">1,247</span>
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
      </div>
    </div>
  );
};

export default DashboardToolCards;