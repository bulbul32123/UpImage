import Icon from '../../components/AppIcon';

const WelcomeBanner = ({ user }) => {
  const currentHour = new Date()?.getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUsagePercentage = (used, total) => {
    return Math.round((used / total) * 100);
  };

  return (
    <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white shadow-elevated mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h1 className="text-fluid-2xl font-semibold mb-2">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-white/90 mb-4 lg:mb-0">
            Ready to process your files? You have {user?.creditsRemaining} credits remaining this month.
          </p>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-white/90">{user?.subscription}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} color="white" />
              <span className="text-sm text-white/90">
                {new Date()?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-0 lg:ml-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/90">Usage This Month</span>
              <span className="text-sm font-medium">
                {user?.creditsUsed} / {user?.creditsTotal}
              </span>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-2 mb-3">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${getUsagePercentage(user?.creditsUsed, user?.creditsTotal)}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-semibold">{user?.filesProcessed}</p>
                <p className="text-xs text-white/80">Files</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{user?.storageUsed}GB</p>
                <p className="text-xs text-white/80">Storage</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{user?.toolsUsed}</p>
                <p className="text-xs text-white/80">Tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;