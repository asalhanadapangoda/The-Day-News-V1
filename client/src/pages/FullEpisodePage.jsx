import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { podcastAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const FullEpisodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPodcast();
  }, [id]);

  const fetchPodcast = async () => {
    try {
      setLoading(true);
      setError(null);
      const podcastData = await podcastAPI.getById(id);
      setPodcast(podcastData);
      
      // If no fullVideoLink, redirect to single episode page
      if (!podcastData.fullVideoLink) {
        navigate(`/podcasts/${id}`);
      }
    } catch (err) {
      if (err.message.includes('not found') || err.message.includes('404')) {
        setError('This podcast has been deleted or does not exist.');
        setTimeout(() => {
          navigate('/podcasts');
        }, 3000);
      } else {
        setError(err.message || 'Failed to load podcast');
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract YouTube video ID from various URL formats
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <LoadingSpinner />;
  
  if (error || !podcast) {
    return (
      <div className="min-h-screen py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="glass-card rounded-organic-lg p-8 md:p-10 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-premium-lg">
              Podcast Not Found
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              {error || 'This podcast has been deleted or does not exist.'}
            </p>
            <Link
              to="/podcasts"
              className="inline-block px-6 py-3 btn-liquid rounded-full text-white font-medium text-base md:text-lg ripple"
            >
              Go to Podcasts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const videoId = getYouTubeVideoId(podcast.fullVideoLink);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="min-h-screen py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/podcasts"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Podcasts
          </Link>
        </div>

        {/* Episode Header */}
        <div className="mb-8 md:mb-12 animate-fade-in">
          <div className="glass-card rounded-organic-lg p-6 md:p-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4 text-premium-lg">
              {podcast.name}
            </h1>
            {podcast.description && (
              <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-6 leading-relaxed">
                {podcast.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-500 text-sm md:text-base">
              <span className="px-3 py-1.5 glass-blue rounded-full">
                {formatDate(podcast.createdAt)}
              </span>
              {podcast.duration && (
                <span className="px-3 py-1.5 glass-blue rounded-full">{podcast.duration}</span>
              )}
            </div>
          </div>
        </div>

        {/* YouTube Video Embed */}
        {embedUrl ? (
          <div className="mb-8 md:mb-10 animate-fade-in">
            <div className="glass-card rounded-organic-lg p-4 md:p-6 overflow-hidden">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  title={podcast.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  style={{ border: 'none' }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 md:mb-10 animate-fade-in">
            <div className="glass-card rounded-organic-lg p-6 md:p-8 text-center">
              <p className="text-gray-600 mb-4">Unable to load video. Invalid YouTube URL.</p>
              {podcast.fullVideoLink && (
                <a
                  href={podcast.fullVideoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 btn-liquid rounded-full text-white font-medium text-base md:text-lg ripple"
                >
                  Open Video in New Tab
                </a>
              )}
            </div>
          </div>
        )}

        {/* Episode Details */}
        {(podcast.host || podcast.guest) && (
          <div className="glass-card rounded-organic-lg p-6 md:p-8 mb-8 md:mb-10 animate-fade-in">
            <h3 className="font-semibold text-gray-800 mb-4 md:mb-6 text-lg md:text-xl text-premium">
              Episode Details
            </h3>
            <div className="space-y-3">
              {podcast.host && (
                <p className="text-gray-700 text-base md:text-lg">
                  <span className="font-medium text-gray-800">Host:</span> {podcast.host}
                </p>
              )}
              {podcast.guest && (
                <p className="text-gray-700 text-base md:text-lg">
                  <span className="font-medium text-gray-800">Guest:</span> {podcast.guest}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {podcast.tags && podcast.tags.length > 0 && (
          <div className="mb-8 md:mb-10">
            <div className="flex flex-wrap gap-2 md:gap-3">
              {podcast.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 glass-blue rounded-full text-sm md:text-base font-medium text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Show Notes / Transcript */}
        {(podcast.showNotes || podcast.transcript) && (
          <div className="mb-8 md:mb-10 animate-fade-in">
            <div className="glass-card rounded-organic-lg p-6 md:p-8 lg:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-premium">
                Show Notes
              </h2>
              <div className="prose max-w-none">
                {podcast.showNotes && (
                  <div className="text-gray-700 whitespace-pre-line mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
                    {podcast.showNotes}
                  </div>
                )}
                {podcast.transcript && (
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-4 text-premium">
                      Transcript
                    </h3>
                    <div className="text-gray-700 whitespace-pre-line text-base md:text-lg leading-relaxed">
                      {podcast.transcript}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullEpisodePage;

