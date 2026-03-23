import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    submitTip: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show specific validation errors if available
        let errorMessage = data.message || 'Failed to send message. Please try again.';
        
        // If there are specific validation errors, show them
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorMessages = data.errors.map(err => err.msg || err.message).filter(Boolean);
          if (errorMessages.length > 0) {
            errorMessage = errorMessages[0]; // Show first error
          }
        }
        
        throw new Error(errorMessage);
      }

      // Success
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', submitTip: false });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-10 md:mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 text-premium-lg">
            Contact Us
          </h1>
        </div>

        {/* Contact Form */}
        <div className="glass-card rounded-organic-lg p-8 md:p-10 lg:p-12 mb-8 md:mb-10 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 md:mb-8 text-premium">Send us a message</h2>
          
          {submitted && (
            <div className="glass-blue rounded-organic px-5 py-4 mb-6 text-green-700 border border-green-300/50">
              Thank you for your message! We have received it and will get back to you soon.
            </div>
          )}

          {error && (
            <div className="glass-blue rounded-organic px-5 py-4 mb-6 text-red-700 border border-red-300/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2.5 text-sm md:text-base">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 glass-input rounded-full text-base focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2.5 text-sm md:text-base">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 glass-input rounded-full text-base focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2.5 text-sm md:text-base">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-5 py-3 glass-input rounded-organic text-base focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="submitTip"
                  checked={formData.submitTip}
                  onChange={handleChange}
                  className="mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-gray-700 text-sm md:text-base">Submit a tip</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3.5 btn-liquid rounded-full text-white font-medium text-base md:text-lg ripple disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="glass-card rounded-organic-lg p-8 md:p-10 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 md:mb-8 text-premium">Get in Touch</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Follow Us</h3>
              <div className="space-y-4">
                <a
                  href="https://www.facebook.com/thedaynewsglobal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-3 group transition-colors"
                >
                  <div className="w-10 h-10 glass-blue rounded-full flex items-center justify-center group-hover:glow-blue-hover transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="font-medium">Facebook</span>
                </a>
                <a
                  href="https://www.youtube.com/@TheDayNewsGlobal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 flex items-center space-x-3 group transition-colors"
                >
                  <div className="w-10 h-10 glass-blue rounded-full flex items-center justify-center group-hover:glow-blue-hover transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <span className="font-medium">YouTube</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/the-day-news-global/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800 flex items-center space-x-3 group transition-colors"
                >
                  <div className="w-10 h-10 glass-blue rounded-full flex items-center justify-center group-hover:glow-blue-hover transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <span className="font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

