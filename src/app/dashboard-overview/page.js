"use client"
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import WelcomeBanner from '../../components/dashboard-overview/WelcomeBanner';
import ToolCard from '../../components/dashboard-overview/ToolCard';
import QuickStatsCard from '../../components/dashboard-overview/QuickStatsCard';
import RecentActivityCard from '../../components/dashboard-overview/RecentActivityCard';
import RecentFilesCard from '../../components/dashboard-overview/RecentFilesCard';
import UsageAnalyticsCard from '../../components/dashboard-overview/UsageAnalyticsCard';
import Icon from '../../components/AppIcon';


const DashboardOverview = () => {
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    subscription: "Pro Plan",
    creditsUsed: 1247,
    creditsTotal: 5000,
    creditsRemaining: 3753,
    filesProcessed: 1234,
    storageUsed: 2.4,
    toolsUsed: 8
  });

  const [tools] = useState([
    {
      title: 'Image Processing Tools',
      description: 'Background removal, enhancement, composition, and format conversion with AI-powered precision',
      path: '/image-processing-tools',
      icon: 'Image',
      color: 'bg-accent',
      status: 'active',
      stats: {
        count: '1,234',
        label: 'Images Processed'
      },
      features: [
        'AI Background Removal',
        'Image Enhancement',
        'Format Conversion',
        'Batch Processing',
        'Quality Optimization',
        'Watermark Removal'
      ]
    },
    {
      title: 'PDF Management Hub',
      description: 'Chat with PDFs, summarization, and comprehensive file management with intelligent document analysis',
      path: '/pdf-management-hub',
      icon: 'FileText',
      color: 'bg-primary',
      status: 'active',
      stats: {
        count: '567',
        label: 'PDFs Managed'
      },
      features: [
        'PDF Chat Interface',
        'Document Summarization',
        'Text Extraction',
        'File Organization',
        'OCR Processing',
        'Annotation Tools'
      ]
    },
    {
      title: 'File Converter',
      description: 'Multi-format conversion supporting DOCX, PDF, TXT with batch processing and quality preservation',
      path: '/file-converter',
      icon: 'RefreshCw',
      color: 'bg-success',
      status: 'active',
      stats: {
        count: '890',
        label: 'Files Converted'
      },
      features: [
        'Multi-format Support',
        'Batch Conversion',
        'Quality Preservation',
        'Fast Processing',
        'Cloud Storage',
        'Format Validation'
      ]
    }
  ]);

  const [quickStats] = useState([
    {
      label: 'Files Processed Today',
      value: '23',
      color: 'bg-accent',
      change: 12
    },
    {
      label: 'Storage Used',
      value: '2.4 GB',
      color: 'bg-success',
      change: 5
    },
    {
      label: 'API Calls Remaining',
      value: '1,247',
      color: 'bg-warning',
      change: -8
    },
    {
      label: 'Active Tools',
      value: '8',
      color: 'bg-primary',
      change: 0
    }
  ]);

  const [recentActivity] = useState([
    {
      action: 'Background removed from product image',
      fileName: 'product-shot-01.jpg',
      fileSize: '2.4 MB',
      type: 'image',
      status: 'completed',
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      action: 'Converted DOCX to PDF',
      fileName: 'quarterly-report.docx',
      fileSize: '1.8 MB',
      type: 'convert',
      status: 'completed',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      action: 'Generated PDF summary',
      fileName: 'research-paper.pdf',
      fileSize: '5.2 MB',
      type: 'pdf',
      status: 'processing',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      action: 'Enhanced image quality',
      fileName: 'portrait-photo.png',
      fileSize: '3.1 MB',
      type: 'image',
      status: 'completed',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      action: 'Batch converted 5 images',
      fileName: 'wedding-photos.zip',
      fileSize: '15.7 MB',
      type: 'convert',
      status: 'failed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ]);

  const [recentFiles] = useState([
    {
      name: 'product-hero-bg-removed.png',
      type: 'png',
      size: 2457600,
      status: 'completed',
      lastModified: new Date(Date.now() - 5 * 60 * 1000),
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'
    },
    {
      name: 'quarterly-report-final.pdf',
      type: 'pdf',
      size: 1887436,
      status: 'completed',
      lastModified: new Date(Date.now() - 20 * 60 * 1000),
      thumbnail: null
    },
    {
      name: 'team-photo-enhanced.jpg',
      type: 'jpg',
      size: 3251200,
      status: 'processing',
      lastModified: new Date(Date.now() - 35 * 60 * 1000),
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop'
    },
    {
      name: 'presentation-slides.docx',
      type: 'docx',
      size: 4567890,
      status: 'completed',
      lastModified: new Date(Date.now() - 1 * 60 * 60 * 1000),
      thumbnail: null
    },
    {
      name: 'logo-variations.zip',
      type: 'zip',
      size: 8934567,
      status: 'failed',
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
      thumbnail: null
    }
  ]);

  const [analyticsData] = useState({
    dailyUsage: [
      { day: 'Mon', files: 45 },
      { day: 'Tue', files: 52 },
      { day: 'Wed', files: 38 },
      { day: 'Thu', files: 67 },
      { day: 'Fri', files: 73 },
      { day: 'Sat', files: 29 },
      { day: 'Sun', files: 41 }
    ],
    toolUsage: [
      { name: 'Image Tools', value: 456 },
      { name: 'PDF Tools', value: 234 },
      { name: 'File Converter', value: 189 },
      { name: 'Other Tools', value: 67 }
    ],
    metrics: {
      totalFiles: 2691,
      avgProcessingTime: 3.2,
      successRate: 97.8,
      storageUsed: 2.4
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard Overview - ToolSuite Pro</title>
        <meta name="description" content="Access all your AI-powered file processing tools and monitor usage analytics from your central dashboard." />
      </Helmet>
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <WelcomeBanner user={user} />

          {/* Tool Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tools?.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>

          {/* Stats and Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <QuickStatsCard 
              title="Quick Stats" 
              stats={quickStats}
              className="lg:col-span-1"
            />
            <RecentActivityCard 
              activities={recentActivity}
              className="lg:col-span-2"
            />
          </div>

          {/* Files and Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RecentFilesCard files={recentFiles} />
            <UsageAnalyticsCard analyticsData={analyticsData} />
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Pro Features</h3>
                  <p className="text-sm text-muted-foreground">Unlock advanced capabilities</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Unlimited file processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Priority processing queue</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Advanced AI features</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={20} color="var(--color-success)" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Security</h3>
                  <p className="text-sm text-muted-foreground">Your data is protected</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Auto-delete after 24h</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>GDPR compliant</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-resting border border-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="HeadphonesIcon" size={20} color="var(--color-accent)" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Support</h3>
                  <p className="text-sm text-muted-foreground">We're here to help</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>24/7 chat support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Video tutorials</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>API documentation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;