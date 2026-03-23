import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { podcastAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const EditPodcast = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const data = await podcastAPI.getAllAdmin();
      setPodcasts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await podcastAPI.delete(id);
      setPodcasts(podcasts.filter((p) => p._id !== id));
      setDeleteConfirm(null);
      // Show success message
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete podcast');
      setDeleteConfirm(null);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/admin/dashboard/edit-podcast/${id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Podcasts</h2>
        <button
          onClick={() => navigate('/admin/dashboard/add-podcast')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add New Podcast
        </button>
      </div>

      {podcasts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No podcasts found. Add your first podcast.</p>
          <button
            onClick={() => navigate('/admin/dashboard/add-podcast')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Podcast
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <div key={podcast._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              {podcast.thumbnail && (
                <img
                  src={podcast.thumbnail}
                  alt={podcast.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {podcast.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {podcast.description || podcast.shortDescription}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdate(podcast._id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => setDeleteConfirm(podcast._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this podcast? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPodcast;

