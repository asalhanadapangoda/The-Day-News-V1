import { Link } from 'react-router-dom';

const PodcastCard = ({ podcast }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text, length = 150) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <div className="glass-card rounded-organic overflow-hidden animate-fade-in h-full flex flex-col">
      {/* Card content - not clickable */}
      <div className="flex flex-col flex-1">
        {podcast.thumbnail && (
          <div className="relative h-48 md:h-56 bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden flex-shrink-0">
            <img
              src={podcast.thumbnail}
              alt={podcast.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        )}
        <div className="p-5 md:p-6 flex flex-col flex-1">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-2 text-premium">{podcast.name}</h3>
          <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3 leading-relaxed flex-1">
            {truncateText(podcast.description || podcast.shortDescription)}
          </p>
          <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mt-auto">
            <span className="font-medium">{formatDate(podcast.createdAt)}</span>
            {podcast.duration && <span className="px-2 py-1 glass-blue rounded-full text-xs">{podcast.duration}</span>}
          </div>
        </div>
      </div>
      
      {/* Only the button is clickable */}
      <div className="px-5 md:px-6 pb-5 md:pb-6 mt-auto">
        {podcast.fullVideoLink ? (
          <Link
            to={`/podcasts/${podcast._id}/video`}
            className="block w-full text-center px-4 py-2.5 btn-liquid rounded-full text-white font-medium text-sm md:text-base ripple"
          >
            View Full Episode
          </Link>
        ) : (
          <div className="block w-full text-center px-4 py-2.5 bg-gray-300 rounded-full text-gray-600 font-medium text-sm md:text-base cursor-not-allowed">
            No Video Available
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastCard;

