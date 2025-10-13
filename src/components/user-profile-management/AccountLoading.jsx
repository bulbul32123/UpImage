const AccountLoading = () => (
    <div className="col-span-2 lg:col-span-3">
        <div className="pb-6">
            <div className="bg-card rounded-lg p-6 border border-border shadow-resting">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1">
                        <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse mb-2" />
                        <div className="h-4 w-56 bg-gray-200 rounded-md animate-pulse" />
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border shadow-resting mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-4" />
            <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-4 w-56 bg-gray-200 rounded-md animate-pulse" />
                </div>
            </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border shadow-resting mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
            </div>
        </div>
    </div>
);

export default AccountLoading;
