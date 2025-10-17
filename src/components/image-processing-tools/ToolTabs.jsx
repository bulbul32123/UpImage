"use client"
import React from 'react';
import Icon from '../../components/AppIcon';

const ToolTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'background',
      label: 'Background Removal',
      icon: 'Scissors',
      description: 'Remove or replace image backgrounds'
    },
    {
      id: 'enhancement',
      label: 'Enhancement',
      icon: 'Sparkles',
      description: 'Improve brightness, contrast, and quality'
    },
    {
      id: 'composition',
      label: 'Composition',
      icon: 'Layers',
      description: 'Layer and compose multiple images'
    },
    {
      id: 'conversion',
      label: 'Format Conversion',
      icon: 'RefreshCw',
      description: 'Convert between image formats'
    }
  ];

  return (
    <div className="w-full">
      <div className="lg:hidden mb-6">
        <select
          value={activeTab}
          onChange={(e) => onTabChange(e?.target?.value)}
          className="w-full p-3 bg-card border border-border rounded-lg text-foreground"
        >
          {tabs?.map((tab) => (
            <option key={tab?.id} value={tab?.id}>
              {tab?.label}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden lg:block">
        <div className="border-b border-border">
          <nav className="flex space-x-8" aria-label="Tool tabs">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => onTabChange(tab?.id)}
                className={`group relative py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
                aria-current={activeTab === tab?.id ? 'page' : undefined}
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={tab?.icon} 
                    size={18}
                    color={activeTab === tab?.id ? 'var(--color-primary)' : 'currentColor'}
                    className="transition-colors"
                  />
                  <span>{tab?.label}</span>
                </div>
                
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-floating text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  {tab?.description}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-6 mb-4">
        {tabs?.map((tab) => (
          activeTab === tab?.id && (
            <div key={tab?.id} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={tab?.icon} size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{tab?.label}</h2>
                <p className="text-sm text-muted-foreground">{tab?.description}</p>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ToolTabs;