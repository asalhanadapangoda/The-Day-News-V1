import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { setToken } from '../../utils/auth';
import ErrorMessage from '../../components/common/ErrorMessage';
import logo from '../../assets/The day News Logo.jpeg';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirected due to session expiration
  useEffect(() => {
    if (location.state?.sessionExpired) {
      setError('Your session has expired. Please login again.');
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Trim and normalize username input
    const normalizedValue = name === 'username' ? value.trim().toLowerCase() : value;
    
    setFormData({
      ...formData,
      [name]: normalizedValue,
    });
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const { username, password } = formData;
    
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    
    if (username.length > 30) {
      setError('Username cannot exceed 30 characters');
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const data = await authAPI.login(formData.username.trim().toLowerCase(), formData.password);
      if (data.token) {
        // Use setToken utility which also sets session start time
        setToken(data.token);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      // Handle rate limiting errors
      if (err.message && err.message.includes('Too many')) {
        setError('Too many login attempts. Please wait 15 minutes before trying again.');
      } else {
      setError(err.message || 'Invalid credentials');
      }
      // Clear any invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('sessionStartTime');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-organic-lg p-8 md:p-10 lg:p-12 w-full max-w-md mx-auto animate-fade-in">
          <div className="text-center mb-8 md:mb-10">
            <div className="flex items-center justify-center mb-6">
              <img 
                src={logo} 
                alt="THE DAY NEWS" 
                className="h-16 md:h-20 w-auto object-contain"
              />
          </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 text-premium-lg">Admin Login</h1>
            <p className="text-gray-600 text-base md:text-lg">THE DAY NEWS</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2.5 text-sm md:text-base">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
                className="w-full px-5 py-3 glass-input rounded-full text-base focus:outline-none"
            />
          </div>

          <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2.5 text-sm md:text-base">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
                className="w-full px-5 py-3 glass-input rounded-full text-base focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
              className="w-full px-8 py-3.5 btn-liquid rounded-full text-white font-medium text-base md:text-lg ripple disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

