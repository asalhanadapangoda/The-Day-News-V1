import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { upcomingAPI } from '../../services/api';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageUpcoming = () => {
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photo: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    try {
      setLoading(true);
      const data = await upcomingAPI.getAll();
      setUpcoming(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll use a file input that accepts URL or file
      // In a real app, you'd upload to a server
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await upcomingAPI.update(editingId, formData);
      } else {
        await upcomingAPI.create(formData);
      }
      setFormData({ name: '', description: '', photo: '' });
      setShowForm(false);
      setEditingId(null);
      fetchUpcoming();
    } catch (err) {
      setError(err.message || 'Failed to save upcoming podcast');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      photo: item.photo || '',
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await upcomingAPI.delete(id);
      setUpcoming(upcoming.filter((item) => item._id !== id));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete upcoming podcast');
      setDeleteConfirm(null);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', photo: '' });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
    <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Upcoming Podcasts</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add Upcoming Podcast
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Podcast Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Podcast Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-gray-700 font-medium mb-2">
              Photo (URL or Upload)
            </label>
            <input
              type="text"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="Enter photo URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.photo && (
              <div className="mt-4">
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {upcoming.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No upcoming podcasts found. Add your first upcoming podcast.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcoming.map((item) => (
            <div key={item._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              {item.photo && (
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(item._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

      {/* Delete Confirmation Modal - Rendered outside main container */}
      {deleteConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setDeleteConfirm(null)}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this upcoming podcast? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageUpcoming;

