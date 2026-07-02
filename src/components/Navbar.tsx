import { useState, useEffect } from 'react';
import { useNavigation } from '../App';
import { Menu, X } from 'lucide-react';

type NavLink = {
  name: string;
  route: 'home' | 'products' | 'contact' | 'admin';
  scrollId?: string;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentRoute, navigate } = useNavigation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [currentRoute]);

  const navLinks: NavLink[] = [
    { name: 'Home', route: 'home' },
    { name: 'Products & Services', route: 'products' },
    { name: 'Courses', route: 'products', scrollId: 'courses' },
    { name: 'Contact', route: 'contact' },
  ];

  const isActive = (route: string) => currentRoute === route;

  const handleNav = (link: NavLink) => {
    setIsOpen(false);
    if (link.scrollId) {
      sessionStorage.setItem('quick_category', link.scrollId);
      if (currentRoute !== link.route) {
        navigate(link.route);
      } else {
        window.dispatchEvent(new CustomEvent('quick-category', { detail: link.scrollId }));
      }
      return;
    }
    navigate(link.route);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-divine-black/95 backdrop-blur-md shadow-lg shadow-divine-purple-900/20'
          : 'bg-divine-black/40 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* DCS Logo */}
          <button onClick={() => navigate('home')} className="flex items-center space-x-2 sm:space-x-3 group min-w-0">
            <img
              src="/images/dcs_logo copy.jpeg"
              alt="Divine Consultation Services5555 Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-contain flex-shrink-0 group-hover:opacity-90 transition-opacity"
            />
            <span className="font-display text-xs sm:text-sm md:text-xl text-gold-gradient hidden sm:block leading-tight truncate">
              Divine Consultation Services5555
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNav(link)}
                className={`font-body text-base lg:text-lg transition-colors duration-300 whitespace-nowrap ${
                  isActive(link.route)
                    ? 'text-divine-gold-400'
                    : 'text-gray-300 hover:text-divine-gold-400'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => navigate('admin')}
              className="font-body text-sm text-divine-purple-400 hover:text-divine-purple-300 transition-colors border border-divine-purple-700/40 px-3 py-1.5 rounded-lg hover:border-divine-purple-500/50"
            >
              Admin
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2.5 -mr-2 active:scale-95 transition-transform"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 sm:top-20 left-0 right-0 bg-divine-black/98 backdrop-blur-md border-t border-divine-purple-700/30 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNav(link)}
                  className={`block w-full text-left font-body text-lg py-3 px-2 rounded-lg transition-colors duration-300 ${
                    isActive(link.route)
                      ? 'text-divine-gold-400 bg-divine-purple-900/20'
                      : 'text-gray-300 hover:text-divine-gold-400 hover:bg-divine-purple-900/10'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => { setIsOpen(false); navigate('admin'); }}
                className="block w-full text-left font-body text-sm py-3 px-2 text-divine-purple-400 hover:text-divine-purple-300 transition-colors"
              >
                Admin Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
