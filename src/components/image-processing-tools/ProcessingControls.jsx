"use client"
import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const ProcessingControls = ({ activeTab, onProcess, isProcessing, onSettingsChange }) => {
  const [backgroundSettings, setBackgroundSettings] = useState({
    mode: 'automatic',
    precision: 'high'
  });

  const [enhancementSettings, setEnhancementSettings] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0
  });

  const [compositionSettings, setCompositionSettings] = useState({
    backgroundType: 'transparent',
    backgroundColor: '#ffffff',
    backgroundImage: null
  });

  const [conversionSettings, setConversionSettings] = useState({
    format: 'png',
    quality: 90,
    resize: false,
    width: '',
    height: ''
  });

  const formatOptions = [
    { value: 'png', label: 'PNG - Best for transparency' },
    { value: 'jpg', label: 'JPG - Smaller file size' },
    { value: 'webp', label: 'WebP - Modern format' },
    { value: 'gif', label: 'GIF - For animations' }
  ];

  const precisionOptions = [
    { value: 'high', label: 'High Precision' },
    { value: 'medium', label: 'Medium Precision' },
    { value: 'fast', label: 'Fast Processing' }
  ];

  const backgroundModeOptions = [
    { value: 'automatic', label: 'Automatic Detection' },
    { value: 'manual', label: 'Manual Selection' },
    { value: 'ai', label: 'AI-Powered' }
  ];

  const backgroundTypeOptions = [
    { value: 'transparent', label: 'Transparent' },
    { value: 'solid', label: 'Solid Color' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'image', label: 'Custom Image' }
  ];

  const handleEnhancementChange = (setting, value) => {
    const newSettings = { ...enhancementSettings, [setting]: value };
    setEnhancementSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleResetEnhancements = () => {
    const resetSettings = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0
    };
    setEnhancementSettings(resetSettings);
    onSettingsChange?.(resetSettings);
  };

  const handleProcess = () => {
    let settings;
    switch (activeTab) {
      case 'background':
        settings = backgroundSettings;
        break;
      case 'enhancement':
        settings = enhancementSettings;
        break;
      case 'composition':
        settings = compositionSettings;
        break;
      case 'conversion':
        settings = conversionSettings;
        break;
      default:
        settings = {};
    }
    onProcess(settings);
  };

  const renderBackgroundControls = () => (
    <div className="space-y-6">
  
  
      {/* Precision / Quality */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Precision / Quality</label>
        <Select
          options={precisionOptions} // High / Medium / Fast
          value={backgroundSettings?.precision}
          onChange={(value) =>
            setBackgroundSettings(prev => ({ ...prev, precision: value }))
          }
        />
      </div>
  
      {backgroundSettings.mode === 'ai' && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Zap" size={16} color="var(--color-primary)" className="mt-0.5" />
            <div className="text-sm">
              <p className="text-foreground font-medium">AI-Powered Removal</p>
              <p className="text-muted-foreground">
                Enhanced background removal using AI for better edge detection and complex backgrounds.
              </p>
            </div>
          </div>
        </div>
      )}
  
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Background Fill</label>
        <Select
          options={backgroundTypeOptions}
          value={compositionSettings?.backgroundType}
          onChange={(value) =>
            setCompositionSettings(prev => ({ ...prev, backgroundType: value }))
          }
        />
        {compositionSettings.backgroundType === 'solid' && (
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="color"
              value={compositionSettings.backgroundColor}
              onChange={(e) =>
                setCompositionSettings(prev => ({ ...prev, backgroundColor: e.target.value }))
              }
              className="w-12 h-10 border border-border rounded cursor-pointer"
            />
            <Input
              type="text"
              value={compositionSettings.backgroundColor}
              onChange={(e) =>
                setCompositionSettings(prev => ({ ...prev, backgroundColor: e.target.value }))
              }
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        )}
        {compositionSettings.backgroundType === 'gradient' && (
          <p className="text-sm text-muted-foreground mt-2">Gradient options can be added here</p>
        )}
        {compositionSettings.backgroundType === 'image' && (
          <p className="text-sm text-muted-foreground mt-2">Upload custom background image</p>
        )}
      </div>
  
      {backgroundSettings.mode === 'manual' && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Manual Refinement</h4>
          <p className="text-muted-foreground text-sm">
            Use brush, erase, or mask tools to refine edges after automatic detection.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button variant="outline" size="sm" iconName="Brush" iconPosition="left">
              Brush
            </Button>
            <Button variant="outline" size="sm" iconName="Eraser" iconPosition="left">
              Erase
            </Button>
            <Button variant="outline" size="sm" iconName="Feather" iconPosition="left">
              Feather
            </Button>
            <Button variant="outline" size="sm" iconName="Smooth" iconPosition="left">
              Smooth
            </Button>
          </div>
        </div>
      )}
  
      <div className="flex items-center space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setBackgroundSettings({ mode: 'automatic', precision: 'high' })
          }
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Wand2"
          iconPosition="left"
          onClick={() => handleProcess(backgroundSettings)}
        >
          Auto Enhance
        </Button>
      </div>
    </div>
  );
  

  const renderEnhancementControls = () => (
    <div className="space-y-8 ">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Brightness: {enhancementSettings.brightness > 0 ? '+' : ''}{enhancementSettings.brightness}
          </label>
          <input
            type="range"
            min="-100"
            max="100"
            value={enhancementSettings.brightness}
            onChange={(e) => handleEnhancementChange('brightness', parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Contrast: {enhancementSettings.contrast > 0 ? '+' : ''}{enhancementSettings.contrast}
          </label>
          <input
            type="range"
            min="-100"
            max="100"
            value={enhancementSettings.contrast}
            onChange={(e) => handleEnhancementChange('contrast', parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Saturation: {enhancementSettings.saturation > 0 ? '+' : ''}{enhancementSettings.saturation}
          </label>
          <input
            type="range"
            min="-100"
            max="100"
            value={enhancementSettings.saturation}
            onChange={(e) => handleEnhancementChange('saturation', parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Sharpness: {enhancementSettings.sharpness > 0 ? '+' : ''}{enhancementSettings.sharpness}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={enhancementSettings.sharpness}
            onChange={(e) => handleEnhancementChange('sharpness', parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Gamma: {enhancementSettings.gamma}
          </label>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={enhancementSettings.gamma}
            onChange={(e) => handleEnhancementChange('gamma', parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Denoise: {enhancementSettings.denoise}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={enhancementSettings.denoise}
            onChange={(e) => handleEnhancementChange('denoise', parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Temperature: {enhancementSettings.temperature}
          </label>
          <input
            type="range"
            min="-100"
            max="100"
            value={enhancementSettings.temperature}
            onChange={(e) => handleEnhancementChange('temperature', parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEnhancementChange('reset', true)}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Wand2"
          iconPosition="left"
          onClick={() => handleEnhancementChange('autoEnhance', true)}
        >
          Auto Enhance
        </Button>
      </div>
    </div>
  );

  const renderCompositionControls = () => (
    <div className="space-y-4">
      <Select
        label="Background Type"
        options={backgroundTypeOptions}
        value={compositionSettings?.backgroundType}
        onChange={(value) => setCompositionSettings(prev => ({ ...prev, backgroundType: value }))}
      />

      {compositionSettings?.backgroundType === 'solid' && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Background Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={compositionSettings?.backgroundColor}
              onChange={(e) => setCompositionSettings(prev => ({ ...prev, backgroundColor: e?.target?.value }))}
              className="w-12 h-10 border border-border rounded cursor-pointer"
            />
            <Input
              type="text"
              value={compositionSettings?.backgroundColor}
              onChange={(e) => setCompositionSettings(prev => ({ ...prev, backgroundColor: e?.target?.value }))}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Layer Tools</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" iconName="Layers" iconPosition="left">
            Add Layer
          </Button>
          <Button variant="outline" size="sm" iconName="Move" iconPosition="left">
            Position
          </Button>
          <Button variant="outline" size="sm" iconName="RotateCw" iconPosition="left">
            Rotate
          </Button>
          <Button variant="outline" size="sm" iconName="Scale" iconPosition="left">
            Scale
          </Button>
        </div>
      </div>
    </div>
  );

  const renderConversionControls = () => (
    <div className="space-y-4">
      <Select
        label="Output Format"
        options={formatOptions}
        value={conversionSettings?.format}
        onChange={(value) => setConversionSettings(prev => ({ ...prev, format: value }))}
      />

      {(conversionSettings?.format === 'jpg' || conversionSettings?.format === 'webp') && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Quality: {conversionSettings?.quality}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={conversionSettings?.quality}
            onChange={(e) => setConversionSettings(prev => ({ ...prev, quality: parseInt(e?.target?.value) }))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="resize"
            checked={conversionSettings?.resize}
            onChange={(e) => setConversionSettings(prev => ({ ...prev, resize: e?.target?.checked }))}
            className="rounded border-border"
          />
          <label htmlFor="resize" className="text-sm font-medium text-foreground">
            Resize Image
          </label>
        </div>

        {conversionSettings?.resize && (
          <div className="grid grid-cols-2 gap-3 ml-6">
            <Input
              label="Width (px)"
              type="number"
              value={conversionSettings?.width}
              onChange={(e) => setConversionSettings(prev => ({ ...prev, width: e?.target?.value }))}
              placeholder="1920"
            />
            <Input
              label="Height (px)"
              type="number"
              value={conversionSettings?.height}
              onChange={(e) => setConversionSettings(prev => ({ ...prev, height: e?.target?.value }))}
              placeholder="1080"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderControls = () => {
    switch (activeTab) {
      case 'background':
        return renderBackgroundControls();
      case 'enhancement':
        return renderEnhancementControls();
      case 'composition':
        return renderCompositionControls();
      case 'conversion':
        return renderConversionControls();
      default:
        return null;
    }
  };

  return (
    <div className="border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Tool's Options</h3>
      </div>
      <div className=" h-[23rem] overflow-x-hidden p-2">
        {renderControls()}
      </div>

      <div className="pt-4 border-t border-border">
        <Button
          variant="default"
          onClick={handleProcess}
          loading={isProcessing}
          iconName="Play"
          iconPosition="left"
          fullWidth
        >
          {isProcessing ? 'Processing...' : 'Start Processing'}
        </Button>
      </div>
    </div>
  );
};

export default ProcessingControls;