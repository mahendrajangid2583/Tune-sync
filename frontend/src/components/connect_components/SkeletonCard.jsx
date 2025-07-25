const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-800 rounded-lg p-4 shadow-md w-full">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-2 bg-gray-700 rounded w-3/4"></div>
        <div className="h-2 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="mt-4 h-4 bg-gray-700 rounded w-full"></div>
  </div>
);

export default SkeletonCard;