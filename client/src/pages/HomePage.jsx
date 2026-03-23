import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { podcastAPI, upcomingAPI } from '../services/api';
import PodcastCard from '../components/common/PodcastCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import coverPage from '../assets/coverPage.png';

const HomePage = () => {
  const [upcomingPodcasts, setUpcomingPodcasts] = useState([]);
  const [latestPodcasts, setLatestPodcasts] = useState([]);
  const [podcastsWithShortVideos, setPodcastsWithShortVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [upcoming, latestList] = await Promise.all([
          upcomingAPI.getAll(),
          podcastAPI.getAll({ limit: 100 }),
        ]);
        setUpcomingPodcasts(upcoming);
        // Sort by upload date (createdAt) and take only 4 for Latest section
        const sorted = (latestList.podcasts || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setLatestPodcasts(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Get upcoming podcasts (max 2)
  const displayUpcoming = upcomingPodcasts.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero/Featured Section with Background Image - Keep existing top layout */}
      <section 
        className="relative text-white py-26 md:py-42 lg:py-50"
        style={{
          backgroundImage: `url(${coverPage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-transparent to-blue-900/50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-premium-lg drop-shadow-2xl">
              Welcome to THE DAY NEWS
            </h1>
          </div>
        </div>
      </section>

    
      {/* Upcoming Podcasts Section */}
      {displayUpcoming.length > 0 && (
        <section className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-blue-cyan opacity-10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-10 md:mb-12 text-center text-premium-lg">
              Upcoming Podcasts
            </h2>
            <div className={`max-w-3xl mx-auto ${displayUpcoming.length === 1 ? 'max-w-2xl' : ''}`}>
              <div className={`grid gap-6 md:gap-8 ${displayUpcoming.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {displayUpcoming.map((upcoming, index) => (
                  <div 
                    key={upcoming._id} 
                    className="glass-card rounded-organic-lg overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {upcoming.photo && (
                      <div className="relative h-56 md:h-72 lg:h-80 overflow-hidden">
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
                    <div className="p-6 md:p-8 lg:p-10">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 md:mb-6 text-premium">
                        {upcoming.name}
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                        {upcoming.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Podcast Section */}
      <section className="py-16 md:py-20 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-10 md:mb-12 text-center text-premium-lg">
            Latest Podcast
          </h2>
          {latestPodcasts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
              {latestPodcasts.map((podcast, index) => (
                <div 
                  key={podcast._id}
                  className="animate-fade-in h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PodcastCard podcast={podcast} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <p className="text-gray-600 text-lg md:text-xl">No podcasts available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

