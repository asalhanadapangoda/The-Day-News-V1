const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-16 md:py-24">
      <div className="relative">
        <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-blue-200 rounded-full"></div>
        <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin absolute top-0 left-0"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 md:w-10 md:h-10 gradient-blue rounded-full glow-blue animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

