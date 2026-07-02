import { useState } from 'react';
import { useNavigation } from '../App';
import {
  Sparkles, X, Gem, Star, Moon, Compass, Users, BarChart2, MessageSquare,
  Heart, Leaf, CreditCard, Edit3, Info, Mail, Calendar, GraduationCap, LayoutGrid,
} from 'lucide-react';

type QuickLink = {
  label: string;
  icon: React.ElementType;
  action: 'products-category' | 'section' | 'navigate';
  payload: string;
};

type QuickGroup = {
  title: string;
  items: QuickLink[];
};

const quickGroups: QuickGroup[] = [
  {
    title: 'Services',
    items: [
      { label: 'Vastu', icon: Compass, action: 'products-category', payload: 'vastu' },
      { label: 'Visiting Card & Logo Design', icon: CreditCard, action: 'products-category', payload: 'visiting_card' },
      { label: 'Numerology', icon: Star, action: 'products-category', payload: 'numerology' },
      { label: 'Name Design & Name Correction', icon: Edit3, action: 'products-category', payload: 'name_design' },
      { label: 'Healings', icon: Heart, action: 'products-category', payload: 'healings' },
      { label: 'Horoscope Analysis', icon: BarChart2, action: 'products-category', payload: 'horoscope' },
      { label: 'Matchmaking', icon: Users, action: 'products-category', payload: 'matchmaking' },
    ],
  },
  {
    title: 'Products',
    items: [
      { label: 'Rudraksh', icon: Leaf, action: 'products-category', payload: 'rudraksh' },
      { label: 'Crystals', icon: Gem, action: 'products-category', payload: 'crystals' },
      { label: 'Ubtan', icon: Sparkles, action: 'products-category', payload: 'ubtan' },
      { label: 'Bath Salts', icon: Moon, action: 'products-category', payload: 'bath_salts' },
    ],
  },
  {
    title: 'Courses',
    items: [
      { label: 'Crystal Healing Course', icon: GraduationCap, action: 'products-category', payload: 'course-crystal_healing' },
      { label: 'Numerology Course', icon: GraduationCap, action: 'products-category', payload: 'course-numerology' },
      { label: 'Vastu Course', icon: GraduationCap, action: 'products-category', payload: 'course-vastu' },
      { label: 'Rudraksh Course', icon: GraduationCap, action: 'products-category', payload: 'course-rudraksh' },
      { label: 'Horoscope Reading Course', icon: GraduationCap, action: 'products-category', payload: 'course-horoscope' },
      { label: 'Healing Techniques Course', icon: GraduationCap, action: 'products-category', payload: 'course-healing' },
    ],
  },
  {
    title: 'Other',
    items: [
      { label: 'About Us', icon: Info, action: 'section', payload: 'about' },
      { label: 'Testimonials', icon: MessageSquare, action: 'section', payload: 'testimonials' },
      { label: 'Contact Us', icon: Mail, action: 'navigate', payload: 'contact' },
      { label: 'Book Consultation', icon: Calendar, action: 'navigate', payload: 'contact' },
    ],
  },
];

export default function QuickAccessMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { navigate, currentRoute } = useNavigation();

  const handleLinkClick = (link: QuickLink) => {
    setIsOpen(false);

    if (link.action === 'navigate') {
      navigate(link.payload as 'contact');
      return;
    }

    if (link.action === 'section') {
      if (currentRoute !== 'home') {
        navigate('home');
        setTimeout(() => {
          document.getElementById(link.payload)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        document.getElementById(link.payload)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // products-category
    sessionStorage.setItem('quick_category', link.payload);
    if (currentRoute !== 'products') {
      navigate('products');
    } else {
      window.dispatchEvent(new CustomEvent('quick-category', { detail: link.payload }));
    }
  };

  return (
    <div className="fixed right-3 sm:right-6 bottom-44 z-40">
      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[min(92vw,340px)] max-h-[70vh] overflow-y-auto bg-divine-darker/98 backdrop-blur-md border border-divine-purple-700/40 rounded-xl shadow-2xl shadow-divine-purple-900/40">
          <div className="flex items-center justify-between p-3 border-b border-divine-purple-700/30 sticky top-0 bg-divine-darker/98 backdrop-blur-md z-10">
            <span className="font-display text-sm text-divine-gold-400 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> Quick Access
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 active:scale-90 transition-transform"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-3 space-y-4">
            {quickGroups.map((group) => (
              <div key={group.title}>
                <h4 className="font-display text-xs uppercase tracking-wider text-divine-purple-400 mb-2 px-1">
                  {group.title}
                </h4>
                <div className="space-y-0.5">
                  {group.items.map((link) => {
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.label}
                        onClick={() => handleLinkClick(link)}
                        className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg text-gray-300 hover:text-divine-gold-400 hover:bg-divine-purple-900/20 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-md bg-divine-purple-800/60 border border-divine-purple-700/30 flex items-center justify-center flex-shrink-0 group-hover:border-divine-gold-500/40 transition-colors">
                          <Icon className="h-4 w-4 text-divine-gold-400" />
                        </div>
                        <span className="text-sm font-body leading-tight">{link.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen
            ? 'bg-divine-purple-700 border-2 border-divine-gold-400 shadow-divine-gold-400/30'
            : 'bg-divine-purple-800 border-2 border-divine-purple-600/60 shadow-divine-purple-500/30 hover:border-divine-gold-500/50'
        }`}
        aria-label="Quick access menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-divine-gold-400" />
        ) : (
          <Sparkles className="h-6 w-6 text-divine-gold-400 animate-pulse" />
        )}
      </button>
    </div>
  );
}
