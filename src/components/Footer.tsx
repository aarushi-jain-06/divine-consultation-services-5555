import { useNavigation } from '../App';
import { Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-divine-darker border-t border-divine-purple-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <button onClick={() => navigate('home')} className="flex items-center space-x-2 group mb-4">
              <img
                src="/images/dcs_logo copy.jpeg"
                alt="Divine Consultation Services5555 Logo"
                className="h-10 w-10 rounded-lg object-contain"
              />
              <span className="font-display text-base text-gold-gradient">
                Divine Consultation Services5555
              </span>
            </button>
            <p className="text-gray-400 font-body text-sm leading-relaxed">
              Discover ancient wisdom through crystals, numerology, Vastu, Rudraksh, and spiritual guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-divine-gold-400 text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', route: 'home' as const },
                { label: 'Products & Services', route: 'products' as const },
                { label: 'Contact Us', route: 'contact' as const },
              ].map(({ label, route }) => (
                <li key={route}>
                  <button
                    onClick={() => navigate(route)}
                    className="text-gray-400 hover:text-divine-gold-400 transition-colors font-body text-sm"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="https://calendly.com/ruchijainhzb/consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-divine-gold-400 transition-colors font-body text-sm flex items-center space-x-1"
                >
                  <span>Book Consultation</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-divine-gold-400 text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4 text-divine-purple-400 flex-shrink-0" />
                <a
                  href="mailto:ruchijainhzb@gmail.com"
                  className="font-body text-sm hover:text-divine-gold-400 transition-colors"
                >
                  ruchijainhzb@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4 text-divine-purple-400 flex-shrink-0" />
                <a
                  href="tel:7520573831"
                  className="font-body text-sm hover:text-divine-gold-400 transition-colors"
                >
                  +91 7520573831
                </a>
              </li>
              <li>
                <a
                  href="https://whatsapp.com/channel/0029VaXYBWxGufInXXS4gw1F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors font-body text-sm"
                >
                  <span>WhatsApp Channel</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-divine-purple-700/20 text-center">
          <p className="text-gray-500 font-sans text-sm">
            &copy; {new Date().getFullYear()} Divine Consultation Services5555. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
