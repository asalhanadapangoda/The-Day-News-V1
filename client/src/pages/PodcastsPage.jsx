import { useEffect, useState } from 'react';
import { podcastAPI } from '../services/api';
import PodcastCard from '../components/common/PodcastCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const PodcastsPage = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [groupedPodcasts, setGroupedPodcasts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPodcasts();
  }, [searchTerm]);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      // Fetch all podcasts to group by section
      const data = await podcastAPI.getAll({
        limit: 1000, // Get all podcasts to group them
        search: searchTerm,
      });
      const allPodcasts = data.podcasts || [];
      setPodcasts(allPodcasts);
      
      // Group podcasts by section
      const grouped = {};
      allPodcasts.forEach((podcast) => {
        if (podcast.section && podcast.section._id) {
          const sectionId = podcast.section._id;
          const sectionName = podcast.section.name;
          
          if (!grouped[sectionId]) {
            grouped[sectionId] = {
              section: podcast.section,
              podcasts: [],
            };
          }
          grouped[sectionId].podcasts.push(podcast);
        } else {
          // Podcasts without section
          if (!grouped['no-section']) {
            grouped['no-section'] = {
              section: null,
              podcasts: [],
            };
          }
          grouped['no-section'].podcasts.push(podcast);
        }
      });
      
      setGroupedPodcasts(grouped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPodcasts();
  };

  if (loading && podcasts.length === 0) return <LoadingSpinner />;
  if (error && podcasts.length === 0) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-10 md:mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 text-premium-lg">
            All Podcasts
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our collection of insightful podcast episodes
          </p>
        </div>

        {/* Search/Filter Bar */}
        <form onSubmit={handleSearch} className="mb-10 md:mb-12 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search podcasts..."
              className="flex-1 px-5 py-3.5 glass-input rounded-full text-base focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-3.5 btn-liquid rounded-full text-white font-medium text-base ripple whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>

        {/* Podcasts Grouped by Section */}
        {loading && podcasts.length === 0 ? (
          <LoadingSpinner />
        ) : Object.keys(groupedPodcasts).length > 0 ? (
          <div className="space-y-12 md:space-y-16">
            {Object.entries(groupedPodcasts).map(([sectionId, group], groupIndex) => {
              // Don't show sections with no podcasts
              if (group.podcasts.length === 0) {
                return null;
              }
              
              return (
                <div 
                  key={sectionId}
                  className="animate-fade-in"
                  style={{ animationDelay: `${groupIndex * 0.1}s` }}
                >
                  {/* Section Header */}
                  {group.section && (
                    <div className="mb-6 md:mb-8">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-premium-lg">
                        {group.section.name}
                      </h2>
                      {group.section.description && (
                        <p className="text-gray-600 mt-2 text-base md:text-lg">
                          {group.section.description}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Podcasts Grid for this Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {group.podcasts.map((podcast, index) => (
                      <div 
                        key={podcast._id}
                        className="animate-fade-in h-full"
                        style={{ animationDelay: `${(groupIndex * 0.1) + (index * 0.05)}s` }}
                      >
                        <PodcastCard podcast={podcast} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 md:py-20">
            <div className="glass-card rounded-organic-lg p-8 md:p-12 max-w-md mx-auto">
              <p className="text-gray-600 text-lg md:text-xl">No podcasts found.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastsPage;

