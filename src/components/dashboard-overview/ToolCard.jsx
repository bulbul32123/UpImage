"use client"
import Link from 'next/link'
import Icon from '../../components/AppIcon';

const ToolCard = ({ tool }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'processing':
        return 'bg-warning';
      case 'maintenance':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Available';
      case 'processing':
        return 'Processing';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  return (
    <Link
     href={tool?.path}
      className="group bg-card rounded-lg p-6 shadow-resting border border-border hover:shadow-elevated transition-all duration-200 hover:scale-[1.02] block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${tool?.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <Icon name={tool?.icon} size={24} color="white" />
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-2 h-2 ${getStatusColor(tool?.status)} rounded-full`}></div>
            <span className="text-xs text-muted-foreground">{getStatusText(tool?.status)}</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{tool?.stats?.count}</p>
          <p className="text-xs text-muted-foreground">{tool?.stats?.label}</p>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {tool?.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {tool?.description}
      </p>
      <div className="space-y-2 mb-4">
        {tool?.features?.slice(0, 3)?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
            <span className="text-xs text-muted-foreground">{feature}</span>
          </div>
        ))}
        {tool?.features?.length > 3 && (
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-muted rounded-full flex-shrink-0"></div>
            <span className="text-xs text-muted-foreground">
              +{tool?.features?.length - 3} more features
            </span>
          </div>
        )}
      </div>
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
            Open Tool
          </span>
          <Icon 
            name="ArrowRight" 
            size={16} 
            color="var(--color-primary)"
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;