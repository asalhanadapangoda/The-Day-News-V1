import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { podcastAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import AudioPlayer from '../components/common/AudioPlayer';
import PodcastCard from '../components/common/PodcastCard';

const SingleEpisodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [relatedPodcasts, setRelatedPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPodcast();
  }, [id]);

  const fetchPodcast = async () => {
    try {
      setLoading(true);
      setError(null);
      const [podcastData, related] = await Promise.all([
        podcastAPI.getById(id),
        podcastAPI.getRelated(id),
      ]);
      setPodcast(podcastData);
      setRelatedPodcasts(related);
    } catch (err) {
      // If podcast not found or deleted, redirect to podcasts page
      if (err.message.includes('not found') || err.message.includes('404')) {
        setError('This podcast has been deleted or does not exist.');
        // Redirect to podcasts page after 3 seconds
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(podcast.name)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
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
            <p className="text-gray-500 mb-8 text-sm">
              Redirecting to podcasts page...
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

  return (
    <div className="min-h-screen py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Episode Header */}
        <div className="mb-8 md:mb-12 animate-fade-in">
          {podcast.coverImage && (
            <div className="glass-card rounded-organic-lg overflow-hidden mb-6 md:mb-8">
              <img
                src={podcast.coverImage}
                alt={podcast.name}
                className="w-full h-64 md:h-96 object-cover"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
          )}
          <div className="glass-card rounded-organic-lg p-6 md:p-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4 text-premium-lg">{podcast.name}</h1>
            {podcast.description && (
              <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-6 leading-relaxed">{podcast.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-500 text-sm md:text-base">
              <span className="px-3 py-1.5 glass-blue rounded-full">{formatDate(podcast.createdAt)}</span>
              {podcast.duration && <span className="px-3 py-1.5 glass-blue rounded-full">{podcast.duration}</span>}
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {podcast.audioUrl && (
          <div className="mb-8 md:mb-10 animate-fade-in">
            <div className="glass-card rounded-organic-lg p-6 md:p-8">
              <AudioPlayer audioUrl={podcast.audioUrl} title={podcast.name} />
            </div>
          </div>
        )}

        {/* Host/Guest Info */}
        {(podcast.host || podcast.guest) && (
          <div className="glass-card rounded-organic-lg p-6 md:p-8 mb-8 md:mb-10 animate-fade-in">
            <h3 className="font-semibold text-gray-800 mb-4 md:mb-6 text-lg md:text-xl text-premium">Episode Details</h3>
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

        {/* Share Buttons */}
        <div className="mb-8 md:mb-10 animate-fade-in">
          <h3 className="font-semibold text-gray-800 mb-4 md:mb-6 text-lg md:text-xl text-premium">Share this episode</h3>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <button
              onClick={shareOnFacebook}
              className="px-5 py-2.5 btn-liquid rounded-full text-white font-medium text-sm md:text-base flex items-center space-x-2 ripple"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
            <button
              onClick={shareOnTwitter}
              className="px-5 py-2.5 rounded-full text-white font-medium text-sm md:text-base flex items-center space-x-2 ripple"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
                border: '1px solid rgba(147, 197, 253, 0.4)',
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4), 0 0 0 1px rgba(147, 197, 253, 0.2) inset',
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              <span>Twitter</span>
            </button>
            <button
              onClick={copyLink}
              className="px-5 py-2.5 glass rounded-full text-gray-700 font-medium text-sm md:text-base flex items-center space-x-2 hover:glow-blue-hover transition-all ripple"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        {/* Show Notes / Transcript */}
        {(podcast.showNotes || podcast.transcript) && (
          <div className="mb-8 md:mb-10 animate-fade-in">
            <div className="glass-card rounded-organic-lg p-6 md:p-8 lg:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-premium">Show Notes</h2>
              <div className="prose max-w-none">
                {podcast.showNotes && (
                  <div className="text-gray-700 whitespace-pre-line mb-6 md:mb-8 text-base md:text-lg leading-relaxed">{podcast.showNotes}</div>
                )}
                {podcast.transcript && (
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-4 text-premium">Transcript</h3>
                    <div className="text-gray-700 whitespace-pre-line text-base md:text-lg leading-relaxed">{podcast.transcript}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Related Episodes */}
        {relatedPodcasts.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 md:mb-10 text-center text-premium-lg">Related Episodes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {relatedPodcasts.map((related, index) => (
                <div 
                  key={related._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PodcastCard podcast={related} showPlayIcon={true} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleEpisodePage;

