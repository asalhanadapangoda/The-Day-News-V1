import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const SingleArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await articleAPI.getById(id);
      setArticle(data);
    } catch (err) {
      setError(err.message);
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!article) return <ErrorMessage message="Article not found" />;

  return (
    <div className="min-h-screen py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-6">
          <Link
            to="/articles"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>
        </div>

        <article className="glass-card rounded-organic-lg overflow-hidden">
          {article.photo && (
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
              <img
                src={article.photo}
                alt={article.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          )}

          <div className="p-6 md:p-8 lg:p-10">
            <div className="mb-4">
              {article.section && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                  {article.section.name}
                </span>
              )}
              <span className="text-gray-500 text-sm ml-3">{formatDate(article.createdAt)}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-premium-lg">
              {article.name}
            </h1>

            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SingleArticlePage;

