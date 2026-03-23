import { Link } from 'react-router-dom';
import logo from '../../assets/The day News Logo.jpeg';

const Footer = () => {
  return (
    <footer className="glass-blue border-t border-white/20 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={logo} 
                alt="THE DAY NEWS" 
                className="h-10 md:h-12 w-auto object-contain"
              />
              <span className="text-lg md:text-xl font-bold text-gray-800 text-premium">THE DAY NEWS</span>
            </div>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Your Media Partner In Cyberspace
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 md:mb-6 text-gray-800 text-base md:text-lg">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/podcasts" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                  Podcasts
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4 md:mb-6 text-gray-800 text-base md:text-lg">Connect</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://www.facebook.com/thedaynewsglobal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base flex items-center space-x-2 group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@TheDayNewsGlobal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-600 transition-colors text-sm md:text-base flex items-center space-x-2 group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/the-day-news-global/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-700 transition-colors text-sm md:text-base flex items-center space-x-2 group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 md:mb-6 text-gray-800 text-base md:text-lg">Stay Updated</h3>
            <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
              Subscribe to get the latest podcasts updates.
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 md:mt-10 pt-8 md:pt-10 text-center text-gray-600 text-sm md:text-base">
          <p>&copy; {new Date().getFullYear()} THE DAY NEWS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

