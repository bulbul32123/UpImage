import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../components/AppIcon';

const UsageAnalyticsCard = ({ analyticsData, className = "" }) => {
  const COLORS = ['#2563EB', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-floating">
          <p className="text-sm font-medium text-foreground">{`${label}: ${payload?.[0]?.value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; 
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100)?.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={`bg-card rounded-lg p-6 shadow-resting border border-border ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Usage Analytics</h2>
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          <select className="text-sm bg-transparent border border-border rounded px-2 py-1 text-foreground">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-sm font-medium text-foreground mb-3">Daily Processing Volume</h3>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData?.dailyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="day" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="files" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Tool Usage Distribution</h3>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.toolUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData?.toolUsage?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Usage Statistics</h3>
          <div className="space-y-4">
            {analyticsData?.toolUsage?.map((tool, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                  ></div>
                  <span className="text-sm text-foreground">{tool?.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-foreground">{tool?.value}</span>
                  <p className="text-xs text-muted-foreground">
                    {((tool?.value / analyticsData?.toolUsage?.reduce((sum, t) => sum + t?.value, 0)) * 100)?.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{analyticsData?.metrics?.totalFiles}</p>
            <p className="text-xs text-muted-foreground">Total Files</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{analyticsData?.metrics?.avgProcessingTime}s</p>
            <p className="text-xs text-muted-foreground">Avg Processing</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{analyticsData?.metrics?.successRate}%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{analyticsData?.metrics?.storageUsed}GB</p>
            <p className="text-xs text-muted-foreground">Storage Used</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalyticsCard;