import Link from 'next/link';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const RecentFilesCard = ({ files, className = "" }) => {
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return 'FileText';
      case 'jpg': case'jpeg': case'png': case'webp': case'gif':
        return 'Image';
      case 'docx': case'doc':
        return 'FileType';
      case 'txt':
        return 'FileText';
      default:
        return 'File';
    }
  };

  const getFileTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return 'bg-error';
      case 'jpg': case'jpeg': case'png': case'webp': case'gif':
        return 'bg-accent';
      case 'docx': case'doc':
        return 'bg-primary';
      case 'txt':
        return 'bg-secondary';
      default:
        return 'bg-muted';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const fileTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - fileTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`bg-card rounded-lg p-6 shadow-resting border border-border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Files</h2>
        <Link 
          href="/files" 
          className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center space-x-1"
        >
          <span>View All</span>
          <Icon name="ArrowRight" size={14} />
        </Link>
      </div>
      <div className="space-y-3">
        {files?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="FolderOpen" size={48} color="var(--color-muted)" className="mx-auto mb-3" />
            <p className="text-muted-foreground">No recent files</p>
            <p className="text-sm text-muted-foreground">Upload files to see them here</p>
          </div>
        ) : (
          files?.map((file, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
              <div className="relative flex-shrink-0">
                {file?.thumbnail ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <Image 
                      src={file?.thumbnail} 
                      alt={file?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-12 h-12 ${getFileTypeColor(file?.type)} rounded-lg flex items-center justify-center`}>
                    <Icon name={getFileIcon(file?.type)} size={20} color="white" />
                  </div>
                )}
                
                {file?.status === 'processing' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full flex items-center justify-center">
                    <Icon name="Loader2" size={10} color="white" className="animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {file?.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground uppercase">{file?.type}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{formatFileSize(file?.size)}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{getTimeAgo(file?.lastModified)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                {file?.status === 'completed' && (
                  <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                )}
                {file?.status === 'processing' && (
                  <Icon name="Clock" size={16} color="var(--color-warning)" />
                )}
                {file?.status === 'failed' && (
                  <Icon name="AlertCircle" size={16} color="var(--color-error)" />
                )}
                
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded">
                  <Icon name="MoreVertical" size={14} color="var(--color-muted-foreground)" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {files?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {files?.length} recent files
            </span>
            <Link 
              href="/files"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Manage Files
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentFilesCard;