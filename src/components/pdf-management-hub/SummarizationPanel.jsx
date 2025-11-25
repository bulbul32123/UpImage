"use client"
import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const SummarizationPanel = ({ selectedFile, onGenerateSummary }) => {
  const [summaryType, setSummaryType] = useState('brief');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState(null);
  const [summaryHistory, setSummaryHistory] = useState([]);

  const summaryOptions = [
    { value: 'brief', label: 'Brief Summary', description: '2-3 sentences overview' },
    { value: 'detailed', label: 'Detailed Summary', description: 'Comprehensive analysis' },
    { value: 'key-points', label: 'Key Points', description: 'Bullet point highlights' },
    { value: 'executive', label: 'Executive Summary', description: 'Business-focused overview' }
  ];

  const mockSummaries = {
    brief: `This business proposal outlines the implementation of an AI-powered customer service solution designed to enhance customer satisfaction while reducing operational costs. The proposed system will integrate seamlessly with existing infrastructure and provide 24/7 support capabilities. The project has an estimated ROI of 285% over three years with a break-even point at month 14.`,
    
    detailed: `**Executive Summary**\nThis comprehensive business proposal presents a strategic initiative to implement an AI-powered customer service solution that addresses current operational challenges while positioning the company for future growth.\n\n**Current State Analysis**\nThe organization currently faces several customer service challenges including high volumes of repetitive inquiries, limited support hours, increasing operational costs, and inconsistent response quality across different agents.\n\n**Proposed Solution**\nThe recommended AI chatbot system will handle 80% of common customer inquiries automatically, with seamless escalation to human agents for complex issues. The system includes natural language processing, machine learning capabilities, and integration with existing CRM systems.\n\n**Financial Projections**\nImplementation costs total $84,000 with projected savings of $78,000 in year one, $95,000 in year two, and $112,000 in year three. The break-even point is projected at month 14 with a three-year ROI of 285%.\n\n**Implementation Timeline**\nThe project will be executed in three phases over 6 months, including system setup, integration, testing, and staff training.`,
    
    'key-points': `**Key Implementation Points:**\n• AI chatbot will handle 80% of common customer inquiries\n• 24/7 customer support availability\n• Seamless escalation to human agents for complex issues\n• Integration with existing CRM systems\n\n**Financial Highlights:**\n• Total implementation cost: $84,000\n• Year 1 savings: $78,000\n• Year 2 savings: $95,000\n• Year 3 savings: $112,000\n• Break-even: Month 14\n• 3-year ROI: 285%\n\n**Timeline:**\n• Phase 1: System setup (2 months)\n• Phase 2: Integration & testing (2 months)\n• Phase 3: Training & deployment (2 months)\n\n**Expected Benefits:**\n• Reduced operational costs\n• Improved customer satisfaction\n• Consistent response quality\n• Scalable support infrastructure`,
    
    executive: `**Strategic Overview**\nThis proposal presents a transformative opportunity to revolutionize our customer service operations through AI implementation, delivering significant cost savings and enhanced customer experience.\n\n**Business Case**\nWith customer service costs rising 15% annually and customer satisfaction scores plateauing, immediate action is required. The proposed AI solution addresses these challenges while positioning us as an industry leader in customer service innovation.\n\n**Investment & Returns**\nThe $84,000 investment will generate $285,000 in savings over three years, representing a 285% ROI. Break-even occurs at month 14, with positive cash flow thereafter.\n\n**Strategic Advantages**\n• Market differentiation through superior customer service\n• Operational efficiency gains of 40%\n• Scalability to support business growth\n• Data-driven insights for continuous improvement\n\n**Recommendation**\nImmediate approval is recommended to capitalize on competitive advantages and realize substantial cost savings. The 6-month implementation timeline ensures rapid value delivery with minimal business disruption.`
  };

  const handleGenerateSummary = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    
    setTimeout(() => {
      const summary = {
        id: Date.now(),
        type: summaryType,
        content: mockSummaries?.[summaryType],
        fileName: selectedFile?.name,
        generatedAt: new Date(),
        wordCount: mockSummaries?.[summaryType]?.split(' ')?.length
      };
      
      setGeneratedSummary(summary);
      setSummaryHistory(prev => [summary, ...prev?.slice(0, 4)]);
      setIsGenerating(false);
      onGenerateSummary?.(summary);
    }, 3000);
  };

  const handleExportSummary = (format) => {
    if (!generatedSummary) return;
    
    console.log(`Exporting summary as ${format}:`, generatedSummary);
    
    const content = `Summary of ${generatedSummary?.fileName}\n\nGenerated: ${generatedSummary?.generatedAt?.toLocaleString()}\nType: ${summaryOptions?.find(opt => opt?.value === generatedSummary?.type)?.label}\n\n${generatedSummary?.content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${generatedSummary?.fileName?.replace('.pdf', '')}.${format}`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-1">Document Summary</h2>
        <p className="text-sm text-muted-foreground">
          Generate AI-powered summaries of your PDF documents
        </p>
      </div>
      {!selectedFile ? (
        (<div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="FileText" size={24} color="var(--color-muted-foreground)" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Document Selected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select a PDF file to generate summaries and extract key insights.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Zap" size={12} />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>Fast Processing</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Download" size={12} />
                <span>Export Options</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Target" size={12} />
                <span>Key Insights</span>
              </div>
            </div>
          </div>
        </div>)
      ) : (
        <>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Summary Type
              </label>
              <Select
                options={summaryOptions}
                value={summaryType}
                onChange={setSummaryType}
                placeholder="Choose summary type"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} color="var(--color-muted-foreground)" />
                <span className="text-sm text-foreground truncate">{selectedFile?.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {(selectedFile?.size / 1024 / 1024)?.toFixed(2)} MB
              </span>
            </div>

            <Button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              loading={isGenerating}
              iconName="Sparkles"
              iconPosition="left"
              fullWidth
            >
              {isGenerating ? 'Generating Summary...' : 'Generate Summary'}
            </Button>
          </div>

          {(generatedSummary || isGenerating) && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="bg-card border border-border rounded-lg">
                  {isGenerating ? (
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Loader2" size={20} color="var(--color-primary)" className="animate-spin" />
                      </div>
                      <h3 className="text-sm font-medium text-foreground mb-2">
                        Analyzing Document...
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        AI is processing your PDF and generating a {summaryOptions?.find(opt => opt?.value === summaryType)?.label?.toLowerCase()}
                      </p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  ) : generatedSummary && (
                    <>
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-foreground">
                            {summaryOptions?.find(opt => opt?.value === generatedSummary?.type)?.label}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {generatedSummary?.wordCount} words
                            </span>
                            <div className="w-2 h-2 bg-success rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Generated {formatDate(generatedSummary?.generatedAt)}
                        </p>
                      </div>

                      <div className="p-4">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                            {generatedSummary?.content}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-foreground">Export Summary</span>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportSummary('txt')}
                              iconName="FileText"
                            >
                              TXT
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportSummary('pdf')}
                              iconName="FileDown"
                            >
                              PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportSummary('docx')}
                              iconName="FileType"
                            >
                              DOCX
                            </Button>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Copy"
                            onClick={() => navigator.clipboard?.writeText(generatedSummary?.content)}
                          >
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Share"
                          >
                            Share
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {summaryHistory?.length > 0 && !isGenerating && (
            <div className="border-t border-border">
              <div className="p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Recent Summaries</h3>
                <div className="space-y-2">
                  {summaryHistory?.slice(0, 3)?.map((summary) => (
                    <div
                      key={summary?.id}
                      onClick={() => setGeneratedSummary(summary)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {summaryOptions?.find(opt => opt?.value === summary?.type)?.label}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {summary?.fileName} • {formatDate(summary?.generatedAt)}
                        </p>
                      </div>
                      <Icon name="ChevronRight" size={14} color="var(--color-muted-foreground)" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SummarizationPanel;