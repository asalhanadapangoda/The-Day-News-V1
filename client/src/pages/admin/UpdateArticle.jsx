import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleAPI, articleSectionAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const UpdateArticle = () => {
  const { id } = useParams();
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
  const [fetching, setFetching] = useState(true);
  const [loadingSections, setLoadingSections] = useState(true);

  useEffect(() => {
    fetchSections();
    fetchArticle();
  }, [id]);

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

  const fetchArticle = async () => {
    try {
      setFetching(true);
      const article = await articleAPI.getById(id);
      setFormData({
        name: article.name || '',
        content: article.content || '',
        section: article.section?._id || article.section || '',
        photo: article.photo || '',
      });
      // Set preview if photo exists
      if (article.photo) {
        setPhotoPreview(article.photo);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
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

      // If no new file but existing photo, keep the existing photo URL
      if (!photoFile && formData.photo) {
        articleData.photo = formData.photo;
      }

      await articleAPI.update(id, articleData, photoFile);
      navigate('/admin/dashboard/edit-article');
    } catch (err) {
      setError(err.message || 'Failed to update article');
    } finally {
      setLoading(false);
    }
  };

  if (fetching || loadingSections) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Article</h2>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="section" className="block text-gray-700 font-medium mb-2">
            Section (Required)
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
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Submit'}
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

export default UpdateArticle;

