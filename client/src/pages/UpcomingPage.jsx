import { useEffect, useState } from 'react';
import { upcomingAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const UpcomingPage = () => {
  const [upcomingPodcasts, setUpcomingPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const data = await upcomingAPI.getAll();
        setUpcomingPodcasts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-10 md:mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 text-premium-lg">
            Upcoming Podcasts
          </h1>
        </div>
        {upcomingPodcasts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {upcomingPodcasts.map((upcoming, index) => (
              <div 
                key={upcoming._id} 
                className="glass-card rounded-organic-lg overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {upcoming.photo && (
                  <div className="relative h-56 md:h-64 overflow-hidden">
                    <img
                      src={upcoming.photo}
                      alt={upcoming.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 text-premium">{upcoming.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{upcoming.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 md:py-20">
            <div className="glass-card rounded-organic-lg p-8 md:p-12 max-w-md mx-auto">
              <p className="text-gray-600 text-lg md:text-xl">No upcoming podcasts at this time. Check back soon!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingPage;

