import { useState, useEffect } from 'react';
import { sectionAPI } from '../../services/api';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const data = await sectionAPI.getAll();
      setSections(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

      try {
        if (editingId) {
          await sectionAPI.update(editingId, formData);
        } else {
          await sectionAPI.create(formData);
        }
        setFormData({ name: '' });
        setShowForm(false);
        setEditingId(null);
        fetchSections();
      } catch (err) {
        setError(err.message || 'Failed to save section');
      }
  };

  const handleEdit = (section) => {
    setFormData({
      name: section.name,
    });
    setEditingId(section._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await sectionAPI.delete(id);
      setSections(sections.filter((s) => s._id !== id));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete section');
      setDeleteConfirm(null);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '' });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Sections</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Section
            </button>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Section Name *
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

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingId ? 'Update' : 'Create'}
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

        {sections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No sections found. Create your first section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <div key={section._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{section.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(section)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(section._id)}
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
              Are you sure you want to delete this section? This action cannot be undone.
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

export default ManageSections;

