import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/The day News Logo.jpeg';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure backdrop-filter is applied via inline style as fallback
  const headerStyle = {
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  };

  const scrolledHeaderStyle = {
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 border-b border-white/20 transition-all duration-300 ${
          isScrolled 
            ? 'glass-blue-scrolled' 
            : 'glass-blue'
        }`}
        style={isScrolled ? scrolledHeaderStyle : headerStyle}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo  */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img 
                src={logo} 
                alt="THE DAY NEWS" 
                className="h-10 md:h-12 w-auto object-contain"
              />
              <span className="text-xl md:text-2xl font-bold text-gray-800 text-premium-lg hidden sm:block">
                THE DAY NEWS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive('/')
                    ? 'text-white bg-blue-600/80 shadow-lg glow-blue'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500/20 hover:shadow-md'
                }`}
              >
                Home
              </Link>
              <Link
                to="/podcasts"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive('/podcasts')
                    ? 'text-white bg-blue-600/80 shadow-lg glow-blue'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500/20 hover:shadow-md'
                }`}
              >
                Podcasts
              </Link>
              <Link
                to="/articles"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive('/articles')
                    ? 'text-white bg-blue-600/80 shadow-lg glow-blue'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500/20 hover:shadow-md'
                }`}
              >
                Articles
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive('/about')
                    ? 'text-white bg-blue-600/80 shadow-lg glow-blue'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500/20 hover:shadow-md'
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive('/contact')
                    ? 'text-white bg-blue-600/80 shadow-lg glow-blue'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500/20 hover:shadow-md'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-500/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="fixed inset-y-0 left-0 w-64 glass-blue border-r border-white/20 drawer-open">
            <div className="flex flex-col h-full pt-20 px-6 space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                  isActive('/')
                    ? 'text-white bg-blue-600/80 shadow-lg glow-blue'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500/20'
                }`}
              >
                Home
              </Link>
              <Link
                to="/podcasts"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                  isActive('/podcasts')
                    ? 'text-white bg-blue-600/80 shadow-lg glow-blue'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500/20'
                }`}
              >
                Podcasts
              </Link>
              <Link
                to="/articles"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                  isActive('/articles')
                    ? 'text-white bg-blue-600/80 shadow-lg glow-blue'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500/20'
                }`}
              >
                Articles
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                  isActive('/about')
                    ? 'text-white bg-blue-600/80 shadow-lg glow-blue'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500/20'
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                  isActive('/contact')
                    ? 'text-white bg-blue-600/80 shadow-lg glow-blue'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500/20'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

