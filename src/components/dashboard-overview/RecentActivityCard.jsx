import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const RecentActivityCard = ({ activities, className = "" }) => {
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'image':
        return 'Image';
      case 'pdf':
        return 'FileText';
      case 'convert':
        return 'RefreshCw';
      case 'upload':
        return 'Upload';
      case 'download':
        return 'Download';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'image':
        return 'bg-accent';
      case 'pdf':
        return 'bg-primary';
      case 'convert':
        return 'bg-success';
      case 'upload':
        return 'bg-warning';
      case 'download':
        return 'bg-secondary';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className={`bg-card rounded-lg p-6 shadow-resting border border-border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <Link 
          to="/activity" 
          className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center space-x-1"
        >
          <span>View All</span>
          <Icon name="ArrowRight" size={14} />
        </Link>
      </div>
      <div className="space-y-3">
        {activities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} color="var(--color-muted)" className="mx-auto mb-3" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground">Start using tools to see your activity here</p>
          </div>
        ) : (
          activities?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-8 h-8 ${getActivityColor(activity?.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon name={getActivityIcon(activity?.type)} size={14} color="white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">{activity?.action}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">{activity?.fileName}</span>
                  {activity?.fileSize && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity?.fileSize}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="text-right flex-shrink-0">
                <span className="text-xs text-muted-foreground">{getTimeAgo(activity?.timestamp)}</span>
                {activity?.status && (
                  <div className="flex items-center space-x-1 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      activity?.status === 'completed' ? 'bg-success' :
                      activity?.status === 'processing' ? 'bg-warning' :
                      activity?.status === 'failed' ? 'bg-error' : 'bg-muted'
                    }`}></div>
                    <span className="text-xs text-muted-foreground capitalize">{activity?.status}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivityCard;