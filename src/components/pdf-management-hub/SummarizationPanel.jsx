"use client"
import React, { useEffect, useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const SummarizationPanel = ({ selectedFile, onGenerateSummary }) => {
  const [summaryType, setSummaryType] = useState('brief');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState(null);
  const [summaryHistory, setSummaryHistory] = useState([]);
  useEffect(() => {
    if (selectedFile?.id) {
      loadSummaryHistory();
    }
  }, [selectedFile]);

  const loadSummaryHistory = async () => {
    if (!selectedFile?.id) return;

    try {
      const response = await fetch(`/api/summary/${selectedFile.id}`);
      const data = await response.json();

      if (data.success) {
        setSummaryHistory(data.summaries);
        if (data.summaries.length > 0) {
          setGeneratedSummary(data.summaries[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load summaries:', error);
    }
  };
  const summaryOptions = [
    { value: 'brief', label: 'Brief Summary', description: '2-3 sentences overview' },
    { value: 'detailed', label: 'Detailed Summary', description: 'Comprehensive analysis' },
    { value: 'key-points', label: 'Key Points', description: 'Bullet point highlights' },
    { value: 'executive', label: 'Executive Summary', description: 'Business-focused overview' }
  ];

  const handleGenerateSummary = async () => {
    if (!selectedFile?.id) return;

    setIsGenerating(true);

    try {
      const response = await fetch(`/api/summary/${selectedFile.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: summaryType })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedSummary(data.summary);
        setSummaryHistory(prev => [data.summary, ...prev.slice(0, 4)]);
        onGenerateSummary?.(data.summary);
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGenerating(false);
    }
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