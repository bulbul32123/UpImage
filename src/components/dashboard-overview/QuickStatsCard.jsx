import Icon from '../../components/AppIcon';

const QuickStatsCard = ({ title, stats, className = "" }) => {
  return (
    <div className={`bg-card rounded-lg p-6 shadow-resting border border-border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <Icon name="TrendingUp" size={20} color="var(--color-success)" />
      </div>
      <div className="space-y-4">
        {stats?.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 ${stat?.color} rounded-full`}></div>
              <span className="text-sm text-foreground">{stat?.label}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-foreground">{stat?.value}</span>
              {stat?.change && (
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={stat?.change > 0 ? "TrendingUp" : "TrendingDown"} 
                    size={12} 
                    color={stat?.change > 0 ? "var(--color-success)" : "var(--color-error)"}
                  />
                  <span className={`text-xs ${stat?.change > 0 ? 'text-success' : 'text-error'}`}>
                    {Math.abs(stat?.change)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStatsCard;