"use client"
import React from 'react';
import Icon from '../../components/AppIcon';
import Select from '../../components/ui/Select';

const FormatSelector = ({ 
  sourceFormat, 
  targetFormat, 
  onSourceChange, 
  onTargetChange, 
  availableFormats,
  className = "" 
}) => {
  const formats = availableFormats || [
    { value: 'pdf', label: 'PDF Document', description: 'Portable Document Format' },
    { value: 'docx', label: 'Word Document', description: 'Microsoft Word format' },
    { value: 'txt', label: 'Text File', description: 'Plain text format' },
    { value: 'doc', label: 'Word 97-2003', description: 'Legacy Word format' },
    { value: 'rtf', label: 'Rich Text Format', description: 'Cross-platform text format' },
    { value: 'odt', label: 'OpenDocument Text', description: 'Open standard format' },
    { value: 'html', label: 'HTML Document', description: 'Web page format' },
    { value: 'epub', label: 'EPUB eBook', description: 'Electronic publication format' }
  ];

  const getConversionSupport = (from, to) => {
    const supportMatrix = {
      'pdf': ['docx', 'txt', 'html'],
      'docx': ['pdf', 'txt', 'html', 'rtf', 'odt'],
      'txt': ['pdf', 'docx', 'html', 'rtf'],
      'doc': ['pdf', 'docx', 'txt', 'html', 'rtf'],
      'rtf': ['pdf', 'docx', 'txt', 'html'],
      'odt': ['pdf', 'docx', 'txt', 'html', 'rtf'],
      'html': ['pdf', 'docx', 'txt'],
      'epub': ['pdf', 'txt', 'html']
    };

    return supportMatrix?.[from]?.includes(to) || false;
  };

  const getAvailableTargets = () => {
    if (!sourceFormat) return formats;
    
    return formats?.filter(format => 
      format?.value !== sourceFormat && getConversionSupport(sourceFormat, format?.value)
    );
  };

  const isConversionSupported = sourceFormat && targetFormat && getConversionSupport(sourceFormat, targetFormat);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Format Selection Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Choose Conversion Format</h3>
        <p className="text-sm text-muted-foreground">
          Select source and target formats for your file conversion
        </p>
      </div>
      {/* Format Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Source Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">From</label>
          <Select
            placeholder="Source format"
            options={formats}
            value={sourceFormat}
            onChange={onSourceChange}
            searchable
          />
        </div>

        {/* Conversion Arrow */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon 
              name="ArrowRight" 
              size={20} 
              color="var(--color-primary)"
              className="transform transition-transform hover:scale-110"
            />
          </div>
        </div>

        {/* Target Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">To</label>
          <Select
            placeholder="Target format"
            options={getAvailableTargets()}
            value={targetFormat}
            onChange={onTargetChange}
            disabled={!sourceFormat}
            searchable
          />
        </div>
      </div>
      {/* Conversion Status */}
      {sourceFormat && targetFormat && (
        <div className={`p-4 rounded-lg border ${
          isConversionSupported 
            ? 'bg-success/10 border-success/20' :'bg-error/10 border-error/20'
        }`}>
          <div className="flex items-center space-x-2">
            <Icon 
              name={isConversionSupported ? "CheckCircle" : "AlertCircle"} 
              size={16} 
              color={isConversionSupported ? "var(--color-success)" : "var(--color-error)"}
            />
            <span className={`text-sm font-medium ${
              isConversionSupported ? 'text-success' : 'text-error'
            }`}>
              {isConversionSupported 
                ? `${sourceFormat?.toUpperCase()} to ${targetFormat?.toUpperCase()} conversion supported`
                : `${sourceFormat?.toUpperCase()} to ${targetFormat?.toUpperCase()} conversion not available`
              }
            </span>
          </div>
        </div>
      )}
      {/* Popular Conversions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Popular Conversions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { from: 'PDF', to: 'DOCX', icon: 'FileText' },
            { from: 'DOCX', to: 'PDF', icon: 'File' },
            { from: 'TXT', to: 'PDF', icon: 'FileText' },
            { from: 'HTML', to: 'PDF', icon: 'Globe' }
          ]?.map((conversion, index) => (
            <button
              key={index}
              onClick={() => {
                onSourceChange(conversion?.from?.toLowerCase());
                onTargetChange(conversion?.to?.toLowerCase());
              }}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
            >
              <Icon name={conversion?.icon} size={14} color="var(--color-muted-foreground)" />
              <span className="text-xs text-foreground">
                {conversion?.from} → {conversion?.to}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Quality Settings */}
      {isConversionSupported && (sourceFormat === 'pdf' || targetFormat === 'pdf') && (
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Quality Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {['High Quality', 'Balanced', 'Small Size']?.map((quality) => (
              <label key={quality} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="quality"
                  value={quality?.toLowerCase()?.replace(' ', '_')}
                  defaultChecked={quality === 'Balanced'}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm text-foreground">{quality}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormatSelector;