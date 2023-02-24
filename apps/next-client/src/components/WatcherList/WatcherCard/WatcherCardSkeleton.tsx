
export const WatcherCardSkeleton = () => {
    return (
        <div className="animate-pulse w-full min-h-[6rem] flex flex-col sm:flex-row sm:space-x-4 space-y-4 pb-4">
            <div className="flex-grow space-y-2">
                <div className="h-4 sm:w-64 bg-gray-200 rounded-full mb-6"/>

                <div className="h-3 sm:w-72 bg-gray-200 rounded-full"/>
                <div className="h-3 sm:w-72 bg-gray-200 rounded-full"/>
                <div className="h-3 sm:w-56 bg-gray-200 rounded-full"/>
            </div>

            <div className="flex flex-col-reverse w-full sm:w-56">
                <div className="flex space-x-2 ml-auto w-full max-w-[14rem]">
                    <div className="h-6 flex-grow bg-gray-200 rounded-lg"/>

                    <div className="h-6 w-6 bg-gray-200 rounded-lg"/>

                    <div className="h-6 w-6 bg-gray-200 rounded-lg"/>
                </div>
            </div>
        </div>
    );
};