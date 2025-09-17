"use client"
import React from 'react';
import Icon from '../../components/AppIcon';
import Select from '../../components/ui/Select';

const FormatSelector = ({
  sourceFormat,
  targetFormat,
  onSourceChange,
  onTargetChange,
  className = ""
}) => {
  const formats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'webp', label: 'WEBP' },
  ];

  const getConversionSupport = (from, to) => {
    const supportMatrix = {
      'png': ['jpg', 'webp', 'jpeg'],
      'jpg': ['png', 'webp', 'jpeg'],
      'webp': ['jpg', 'png', 'jpeg'],
      'jpeg': ['png', 'webp', 'jpg'],
    };

    return supportMatrix?.[from]?.includes(to) || false;
  };

  const getAvailableTargets = () => {
    if (!sourceFormat) return formats;

    return formats?.filter(format =>
      format?.value !== sourceFormat && getConversionSupport(sourceFormat, format?.value)
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
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
    
    </div>
  );
};

export default FormatSelector;






  {/* Conversion Status */}
      {/* {sourceFormat && targetFormat && (
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
      )} */}
      {/* Popular Conversions */}
      {/* <div className="bg-card border border-border rounded-lg p-4">
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
      </div> */}
      {/* Quality Settings */}
      {/* {isConversionSupported && (sourceFormat === 'pdf' || targetFormat === 'pdf') && (
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
      )} */}