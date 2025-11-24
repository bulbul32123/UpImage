"use client"
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const UserAnalytics = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [selectedMetric, setSelectedMetric] = useState('operations');

    const periods = [
        { value: '7days', label: 'Last 7 Days' },
        { value: '30days', label: 'Last 30 Days' },
        { value: '90days', label: 'Last 3 Months' },
        { value: '1year', label: 'Last Year' }
    ];

    const metrics = [
        { value: 'operations', label: 'Operations', icon: 'Activity' },
        { value: 'storage', label: 'Storage Usage', icon: 'HardDrive' },
        { value: 'processing', label: 'Processing Time', icon: 'Clock' }
    ];

    const monthlyUsageData = [
        { month: 'Jan', images: 120, pdfs: 45, conversions: 30, storage: 2.1 },
        { month: 'Feb', images: 150, pdfs: 60, conversions: 40, storage: 2.8 },
        { month: 'Mar', images: 180, pdfs: 75, conversions: 55, storage: 3.2 },
        { month: 'Apr', images: 200, pdfs: 80, conversions: 60, storage: 3.8 },
        { month: 'May', images: 220, pdfs: 95, conversions: 70, storage: 4.1 },
        { month: 'Jun', images: 190, pdfs: 85, conversions: 65, storage: 3.9 },
        { month: 'Jul', images: 240, pdfs: 110, conversions: 80, storage: 4.5 },
        { month: 'Aug', images: 234, pdfs: 89, conversions: 45, storage: 3.2 }
    ];

    const fileTypeDistribution = [
        { name: 'Image Processing', value: 45, color: '#2563EB' },
        { name: 'PDF Operations', value: 30, color: '#0EA5E9' },
        { name: 'File Conversions', value: 25, color: '#10B981' }
    ];

    const dailyActivityData = [
        { day: 'Mon', operations: 45 },
        { day: 'Tue', operations: 52 },
        { day: 'Wed', operations: 38 },
        { day: 'Thu', operations: 61 },
        { day: 'Fri', operations: 55 },
        { day: 'Sat', operations: 28 },
        { day: 'Sun', operations: 32 }
    ];

    const topToolsData = [
        { tool: 'Background Removal', usage: 156, percentage: 35 },
        { tool: 'PDF Chat', usage: 89, percentage: 20 },
        { tool: 'Image Enhancement', usage: 78, percentage: 18 },
        { tool: 'Format Conversion', usage: 67, percentage: 15 },
        { tool: 'PDF Summary', usage: 54, percentage: 12 }
    ];

    const performanceMetrics = {
        totalOperations: 1247,
        averageProcessingTime: '2.3s',
        successRate: '99.2%',
        storageUsed: '3.2GB',
        apiCalls: 2156,
        costSavings: '$450'
    };

    const exportData = () => {
        console.log('Exporting usage data...');
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload?.length) {
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-floating">
                    <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                    {payload?.map((entry, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry?.color }}></span>
                            {entry?.name}: {entry?.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="col-span-2 lg:col-span-3">
             <div className="pb-6">
        <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon
                name={"BarChart3"}
                size={20}
                color="var(--color-primary)"
              />
            </div>
            <div>
              <h1 className="text-fluid-2xl font-semibold text-foreground">
              Usage Analytics
              </h1>
              <p className="text-sm text-muted-foreground">
              Track your usage patterns and performance metrics
              </p>
            </div>
          </div>
        </div>
      </div>
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Usage Analytics</h3>
                        <p className="text-sm text-muted-foreground">
                            Track your tool usage and performance metrics
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e?.target?.value)}
                            className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            {periods?.map(period => (
                                <option key={period?.value} value={period?.value}>{period?.label}</option>
                            ))}
                        </select>

                        <Button variant="outline" onClick={exportData}>
                            <Icon name="Download" size={16} className="mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="bg-card rounded-lg p-4 border border-border shadow-resting">
                    <div className="flex items-center justify-between mb-2">
                        <Icon name="Activity" size={20} color="var(--color-primary)" />
                        <span className="text-xs text-success">+12%</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{performanceMetrics?.totalOperations?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Operations</p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border shadow-resting">
                    <div className="flex items-center justify-between mb-2">
                        <Icon name="Clock" size={20} color="var(--color-accent)" />
                        <span className="text-xs text-success">-8%</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{performanceMetrics?.averageProcessingTime}</p>
                    <p className="text-xs text-muted-foreground">Avg Processing Time</p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border shadow-resting">
                    <div className="flex items-center justify-between mb-2">
                        <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                        <span className="text-xs text-success">+0.2%</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{performanceMetrics?.successRate}</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border shadow-resting">
                    <div className="flex items-center justify-between mb-2">
                        <Icon name="HardDrive" size={20} color="var(--color-warning)" />
                        <span className="text-xs text-warning">+15%</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{performanceMetrics?.storageUsed}</p>
                    <p className="text-xs text-muted-foreground">Storage Used</p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border shadow-resting">
                    <div className="flex items-center justify-between mb-2">
                        <Icon name="Zap" size={20} color="var(--color-primary)" />
                        <span className="text-xs text-success">+25%</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{performanceMetrics?.apiCalls?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">API Calls</p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border shadow-resting">
                    <div className="flex items-center justify-between mb-2">
                        <Icon name="DollarSign" size={20} color="var(--color-success)" />
                        <span className="text-xs text-success">+18%</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{performanceMetrics?.costSavings}</p>
                    <p className="text-xs text-muted-foreground">Cost Savings</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-base font-semibold text-foreground">Monthly Usage Trend</h4>
                        <div className="flex space-x-2">
                            {metrics?.map(metric => (
                                <button
                                    key={metric?.value}
                                    onClick={() => setSelectedMetric(metric?.value)}
                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${selectedMetric === metric?.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {metric?.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyUsageData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis
                                    dataKey="month"
                                    stroke="var(--color-muted-foreground)"
                                    fontSize={12}
                                />
                                <YAxis
                                    stroke="var(--color-muted-foreground)"
                                    fontSize={12}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="images"
                                    stroke="var(--color-primary)"
                                    strokeWidth={2}
                                    dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pdfs"
                                    stroke="var(--color-accent)"
                                    strokeWidth={2}
                                    dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="conversions"
                                    stroke="var(--color-success)"
                                    strokeWidth={2}
                                    dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                    <h4 className="text-base font-semibold text-foreground mb-6">Usage by Tool Type</h4>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={fileTypeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {fileTypeDistribution?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry?.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 space-y-2">
                        {fileTypeDistribution?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item?.color }}
                                    ></div>
                                    <span className="text-sm text-foreground">{item?.name}</span>
                                </div>
                                <span className="text-sm font-medium text-foreground">{item?.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                    <h4 className="text-base font-semibold text-foreground mb-6">Daily Activity (This Week)</h4>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyActivityData}>
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
                                    dataKey="operations"
                                    fill="var(--color-primary)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                    <h4 className="text-base font-semibold text-foreground mb-6">Most Used Tools</h4>

                    <div className="space-y-4">
                        {topToolsData?.map((tool, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-foreground">{tool?.tool}</span>
                                        <span className="text-sm text-muted-foreground">{tool?.usage} uses</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${tool?.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border">
                        <Button variant="outline" fullWidth>
                            <Icon name="BarChart3" size={16} className="mr-2" />
                            View Detailed Analytics
                        </Button>
                    </div>
                </div>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <h4 className="text-base font-semibold text-foreground mb-6">Usage Insights</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name="TrendingUp" size={20} color="var(--color-success)" />
                        </div>
                        <div>
                            <h5 className="text-sm font-medium text-foreground mb-1">Peak Usage Time</h5>
                            <p className="text-xs text-muted-foreground mb-2">
                                Your most active hours are between 2 PM - 4 PM on weekdays
                            </p>
                            <span className="text-xs text-success font-medium">+23% efficiency</span>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name="Target" size={20} color="var(--color-primary)" />
                        </div>
                        <div>
                            <h5 className="text-sm font-medium text-foreground mb-1">Usage Pattern</h5>
                            <p className="text-xs text-muted-foreground mb-2">
                                You process 40% more files on Mondays and Tuesdays
                            </p>
                            <span className="text-xs text-primary font-medium">Weekly trend</span>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                        </div>
                        <div>
                            <h5 className="text-sm font-medium text-foreground mb-1">Optimization Tip</h5>
                            <p className="text-xs text-muted-foreground mb-2">
                                Consider upgrading to Pro plan to unlock batch processing
                            </p>
                            <span className="text-xs text-warning font-medium">Save 30% time</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAnalytics;