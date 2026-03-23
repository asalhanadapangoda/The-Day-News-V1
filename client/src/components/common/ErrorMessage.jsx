const ErrorMessage = ({ message = 'Something went wrong. Please try again.' }) => {
  return (
    <div className="glass rounded-organic-lg p-5 md:p-6 border border-red-300/50 bg-red-50/80 backdrop-blur-md">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-700 text-sm md:text-base font-medium">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;

