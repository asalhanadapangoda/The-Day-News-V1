import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleAPI, articleSectionAPI } from '../../services/api';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AddArticle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    section: '',
    photo: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [sections, setSections] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSections, setLoadingSections] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const data = await articleSectionAPI.getAll();
      setSections(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSections(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      setPhotoFile(file); // Store the actual file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const articleData = {
        name: formData.name,
        content: formData.content,
        section: formData.section || undefined,
        published: true,
      };

      await articleAPI.create(articleData, photoFile);
      navigate('/admin/dashboard/edit-article');
    } catch (err) {
      setError(err.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSections) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Article</h2>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="section" className="block text-gray-700 font-medium mb-2">
            Section (Required - Add section first if none exist)
          </label>
          <select
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a section (required)</option>
            {sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.name}
              </option>
            ))}
          </select>
          {sections.length === 0 && (
            <p className="text-sm text-red-600 mt-2">
              No sections available. Please create a section first.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Article Name *
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
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Article Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="photo" className="block text-gray-700 font-medium mb-2">
            Photo
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {photoPreview && (
            <div className="mt-4">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading || sections.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard/edit-article')}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArticle;

