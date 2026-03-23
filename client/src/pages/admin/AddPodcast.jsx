import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { podcastAPI, sectionAPI } from '../../services/api';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AddPodcast = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fullVideoLink: '',
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
      const data = await sectionAPI.getAll();
      setSections(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSections(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
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
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const podcastData = {
        name: formData.name,
        description: formData.description,
        fullVideoLink: formData.fullVideoLink || undefined,
        section: formData.section || undefined,
        published: true,
      };

      await podcastAPI.create(podcastData, photoFile);
      navigate('/admin/dashboard/edit-podcast');
    } catch (err) {
      setError(err.message || 'Failed to create podcast');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSections) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Podcast</h2>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="section" className="block text-gray-700 font-medium mb-2">
            Section (Optional)
          </label>
          <select
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a section (optional)</option>
            {sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

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

        <div>
          <label htmlFor="fullVideoLink" className="block text-gray-700 font-medium mb-2">
            Full Video Link
          </label>
          <input
            type="url"
            id="fullVideoLink"
            name="fullVideoLink"
            value={formData.fullVideoLink}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard/edit-podcast')}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPodcast;

