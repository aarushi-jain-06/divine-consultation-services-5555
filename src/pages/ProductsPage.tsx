import { useState, useEffect } from 'react';
import { supabase, Product, ProductCategory } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import {
  Gem, Star, Moon, Sparkles, Loader2, Leaf, Compass, Heart, BarChart2, Users,
  CreditCard, Edit3, ShoppingCart, MessageCircle, CheckCircle, X, GraduationCap,
} from 'lucide-react';

const WA_NUMBER = '917520573831';

const categoryConfig: Record<ProductCategory, { icon: React.ElementType; label: string }> = {
  vastu: { icon: Compass, label: 'Vastu' },
  visiting_card: { icon: CreditCard, label: 'Visiting Card & Logo Design' },
  numerology: { icon: Star, label: 'Numerology' },
  name_design: { icon: Edit3, label: 'Name Design & Name Correction' },
  healings: { icon: Heart, label: 'Healings' },
  horoscope: { icon: BarChart2, label: 'Horoscope Analysis' },
  matchmaking: { icon: Users, label: 'Matchmaking' },
  rudraksh: { icon: Leaf, label: 'Rudraksh' },
  crystals: { icon: Gem, label: 'Crystals' },
  ubtan: { icon: Sparkles, label: 'Ubtan' },
  bath_salts: { icon: Moon, label: 'Bath Salts' },
  consultation: { icon: Moon, label: 'Consultations' },
};

type CourseItem = {
  id: string;
  name: string;
  payload: string;
};

const COURSES: CourseItem[] = [
  { id: 'course-crystal_healing', name: 'Crystal Healing Course', payload: 'course-crystal_healing' },
  { id: 'course-numerology', name: 'Numerology Course', payload: 'course-numerology' },
  { id: 'course-vastu', name: 'Vastu Course', payload: 'course-vastu' },
  { id: 'course-rudraksh', name: 'Rudraksh Course', payload: 'course-rudraksh' },
  { id: 'course-horoscope', name: 'Horoscope Reading Course', payload: 'course-horoscope' },
  { id: 'course-healing', name: 'Healing Techniques Course', payload: 'course-healing' },
];

/* ── Shared Modal ─────────────────────────────────────────────────────────── */

function DetailModal({
  title,
  categoryLabel,
  imageUrl,
  description,
  price,
  type,
  courseName,
  onClose,
  children,
}: {
  title: string;
  categoryLabel?: string;
  imageUrl: string | null;
  description: string | null;
  price: number | null;
  type: 'service' | 'product' | 'course';
  courseName?: string;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-divine-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-divine-darker border border-divine-purple-700/40 rounded-xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-divine-black/60 border border-divine-purple-700/40 flex items-center justify-center text-gray-400 hover:text-white hover:bg-divine-purple-800/60 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image */}
        <div className="relative w-full aspect-video sm:aspect-[16/10] rounded-t-xl overflow-hidden bg-divine-black">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              {type === 'course' ? (
                <GraduationCap className="h-16 w-16 text-divine-purple-600/40" />
              ) : (
                <Sparkles className="h-16 w-16 text-divine-purple-600/40" />
              )}
              <span className="text-divine-purple-600/30 font-sans text-xs">Image coming soon</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-divine-darker via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {categoryLabel && (
            <span className="inline-block px-3 py-1 rounded-full bg-divine-purple-900/50 border border-divine-purple-700/30 text-divine-purple-300 text-xs font-sans mb-3">
              {categoryLabel}
            </span>
          )}
          <h3 className="font-display text-xl sm:text-2xl text-divine-gold-400 mb-3">{title}</h3>

          {description ? (
            <p className="text-gray-300 font-body text-base leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          ) : (
            <p className="text-divine-purple-600/40 font-body text-base italic">
              {type === 'course'
                ? 'Detailed description coming soon. Enquire via WhatsApp to learn more.'
                : 'Description coming soon.'}
            </p>
          )}

          {type === 'product' && price != null && (
            <p className="font-display text-lg text-white mt-4">
              ₹{Number(price).toLocaleString('en-IN')}
            </p>
          )}

          {/* Actions */}
          {children && <div className="mt-5">{children}</div>}
        </div>
      </div>
    </div>
  );
}

/* ── Service Card ─────────────────────────────────────────────────────────── */

function ServiceCard({ item, onOpen }: { item: Product; onOpen: () => void }) {
  const cfg = categoryConfig[item.category] ?? { icon: Star, label: item.category };
  const Icon = cfg.icon;

  const openWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hi! I'm interested in your ${item.name} service. Please share more details.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={onOpen}
      className="mystical-card group overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-divine-darker">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Icon className="h-16 w-16 text-divine-purple-600/40" />
            <span className="text-divine-purple-600/30 font-sans text-xs">Image coming soon</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-divine-purple-900/50 border border-divine-purple-700/30 text-divine-purple-300 text-xs font-sans gap-1">
          <Icon className="h-3 w-3" />
          {cfg.label}
        </span>
      </div>

      <h3 className="font-display text-lg text-divine-gold-400 mb-2 group-hover:text-divine-gold-300 transition-colors">
        {item.name}
      </h3>

      {item.description ? (
        <p className="text-gray-400 font-body text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {item.description}
        </p>
      ) : (
        <p className="text-divine-purple-600/30 font-body text-sm italic mb-4 flex-1">
          Description coming soon...
        </p>
      )}

      <div className="pt-4 border-t border-divine-purple-700/20 mt-auto">
        <button
          onClick={openWhatsApp}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-green-700/20 border border-green-700/40 text-green-400 hover:bg-green-700/30 hover:border-green-600 transition-all text-sm font-sans min-h-[44px]"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ── Product Card ─────────────────────────────────────────────────────────── */

function ProductCard({ item, onOpen }: { item: Product; onOpen: () => void }) {
  const cfg = categoryConfig[item.category] ?? { icon: Gem, label: item.category };
  const Icon = cfg.icon;
  const { addItem, items } = useCart();

  const inCart = items.find((i) => i.product.id === item.id);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={onOpen}
      className="mystical-card group overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-divine-darker">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Icon className="h-16 w-16 text-divine-purple-600/40" />
            <span className="text-divine-purple-600/30 font-sans text-xs">Image coming soon</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-divine-purple-900/50 border border-divine-purple-700/30 text-divine-purple-300 text-xs font-sans gap-1">
          <Icon className="h-3 w-3" />
          {cfg.label}
        </span>
      </div>

      <h3 className="font-display text-lg text-divine-gold-400 mb-2 group-hover:text-divine-gold-300 transition-colors">
        {item.name}
      </h3>

      {item.description ? (
        <p className="text-gray-400 font-body text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {item.description}
        </p>
      ) : (
        <p className="text-divine-purple-600/30 font-body text-sm italic mb-4 flex-1">
          Description coming soon...
        </p>
      )}

      <div className="flex items-center justify-between gap-2 pt-4 border-t border-divine-purple-700/20 mt-auto">
        <span className="font-display text-base sm:text-lg text-white min-w-0 truncate">
          {item.price != null ? `₹${Number(item.price).toLocaleString('en-IN')}` : (
            <span className="text-divine-purple-400/60 text-sm font-sans">Price coming soon</span>
          )}
        </span>
        <button
          onClick={handleAddToCart}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-sm font-sans flex-shrink-0 min-h-[40px] ${
            added
              ? 'bg-green-700/20 border-green-700/40 text-green-400'
              : inCart
              ? 'bg-divine-gold-500/10 border-divine-gold-500/40 text-divine-gold-400 hover:bg-divine-gold-500/20'
              : 'border-divine-purple-600/30 text-divine-purple-300 hover:border-divine-gold-500/50 hover:text-divine-gold-400'
          }`}
        >
          {added ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              {inCart ? `In Cart (${inCart.quantity})` : 'Add'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Course Card ──────────────────────────────────────────────────────────── */

function CourseCard({ course, onOpen }: { course: CourseItem; onOpen: () => void }) {
  const openWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hi, I'm interested in the ${course.name} and would like to know more about it.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={onOpen}
      className="mystical-card group overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-divine-darker flex flex-col items-center justify-center gap-3 group-hover:bg-divine-purple-900/20 transition-colors duration-500">
        <GraduationCap className="h-16 w-16 text-divine-purple-600/40 group-hover:scale-110 group-hover:text-divine-gold-500/40 transition-all duration-500" />
        <span className="text-divine-purple-600/30 font-sans text-xs">Image coming soon</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-divine-gold-900/30 border border-divine-gold-700/30 text-divine-gold-400 text-xs font-sans gap-1">
          <GraduationCap className="h-3 w-3" />
          Course
        </span>
      </div>

      <h3 className="font-display text-lg text-divine-gold-400 mb-2 group-hover:text-divine-gold-300 transition-colors">
        {course.name}
      </h3>

      <p className="text-divine-purple-600/30 font-body text-sm italic mb-4 flex-1">
        Description coming soon...
      </p>

      <div className="pt-4 border-t border-divine-purple-700/20 mt-auto">
        <button
          onClick={openWhatsApp}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-green-700/20 border border-green-700/40 text-green-400 hover:bg-green-700/30 hover:border-green-600 transition-all text-sm font-sans min-h-[44px]"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */

export default function ProductsPage() {
  const [services, setServices] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [selectedType, setSelectedType] = useState<'service' | 'product'>('service');
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  useEffect(() => {
    fetchAll();

    const stored = sessionStorage.getItem('quick_category');
    if (stored) {
      sessionStorage.removeItem('quick_category');
      setTimeout(() => {
        const el = document.getElementById(`section-${stored}`) || document.getElementById(stored);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }

    const handleQuickCategory = (e: Event) => {
      const category = (e as CustomEvent).detail as string;
      setTimeout(() => {
        const el = document.getElementById(`section-${category}`) || document.getElementById(category);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    window.addEventListener('quick-category', handleQuickCategory);
    return () => window.removeEventListener('quick-category', handleQuickCategory);
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      const all = data || [];
      setServices(all.filter((p) => p.type === 'service'));
      setProducts(all.filter((p) => p.type === 'product'));
    } catch (err) {
      setError('Failed to load. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openServiceModal = (item: Product) => {
    setSelectedType('service');
    setSelectedItem(item);
  };

  const openProductModal = (item: Product) => {
    setSelectedType('product');
    setSelectedItem(item);
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setSelectedCourse(null);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-divine-black pt-24 sm:pt-28 pb-20 overflow-x-hidden">
      {/* Header */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-divine-purple-900/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-divine-gold-400 mx-auto mb-4" />
          <h1 className="section-title">Services & Products</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Explore our spiritual services and sacred product offerings
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-10 w-10 text-divine-gold-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 px-4">
          <p className="text-red-400 font-body">{error}</p>
          <button onClick={fetchAll} className="mt-4 mystical-button-outline">Try Again</button>
        </div>
      ) : (
        <>
          {/* ── SERVICES ─────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
            <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <div className="min-w-0">
                <h2 className="font-display text-2xl sm:text-3xl text-gold-gradient">Our Services</h2>
                <p className="text-divine-purple-300/60 font-body text-sm mt-1">
                  Spiritual guidance & consultations
                </p>
              </div>
              <div className="flex-1 h-px bg-divine-purple-700/30 min-w-[20px]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {services.map((item) => (
                <div key={item.id} id={`section-${item.category}`}>
                  <ServiceCard item={item} onOpen={() => openServiceModal(item)} />
                </div>
              ))}
            </div>
          </section>

          {/* ── PRODUCTS ─────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
            <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <div className="min-w-0">
                <h2 className="font-display text-2xl sm:text-3xl text-gold-gradient">Our Products</h2>
                <p className="text-divine-purple-300/60 font-body text-sm mt-1">
                  Sacred items & spiritual products
                </p>
              </div>
              <div className="flex-1 h-px bg-divine-purple-700/30 min-w-[20px]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {products.map((item) => (
                <div key={item.id} id={`section-${item.category}`}>
                  <ProductCard item={item} onOpen={() => openProductModal(item)} />
                </div>
              ))}
            </div>

            <p className="text-center text-divine-purple-400/50 font-sans text-sm mt-8">
              Add items to your cart, then place your order instantly via WhatsApp
            </p>
          </section>

          {/* ── COURSES ──────────────────────────────── */}
          <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
            <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <div className="min-w-0">
                <h2 className="font-display text-2xl sm:text-3xl text-gold-gradient">Learn with Us</h2>
                <p className="text-divine-purple-300/60 font-body text-sm mt-1">
                  Expand your knowledge & deepen your spiritual journey
                </p>
              </div>
              <div className="flex-1 h-px bg-divine-purple-700/30 min-w-[20px]" />
            </div>

            <p className="text-gray-400 font-body text-base sm:text-lg max-w-3xl mb-8 sm:mb-10 leading-relaxed">
              Divine Consultation Services5555 offers courses to help you learn about our products and services. Expand your knowledge and deepen your spiritual journey.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {COURSES.map((course) => (
                <div key={course.id} id={course.id}>
                  <CourseCard course={course} onOpen={() => setSelectedCourse(course)} />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Item Detail Modal ─────────────────────── */}
      {selectedItem && (
        <DetailModal
          title={selectedItem.name}
          categoryLabel={categoryConfig[selectedItem.category]?.label}
          imageUrl={selectedItem.image_url}
          description={selectedItem.description}
          price={selectedItem.price}
          type={selectedType}
          onClose={closeItemModal}
        >
          {selectedType === 'service' ? (
            <button
              onClick={() => {
                const message = encodeURIComponent(
                  `Hi! I'm interested in your ${selectedItem.name} service. Please share more details.`
                );
                window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-700/20 border border-green-700/40 text-green-400 hover:bg-green-700/30 hover:border-green-600 transition-all font-sans min-h-[48px]"
            >
              <MessageCircle className="h-5 w-5" />
              Enquire on WhatsApp
            </button>
          ) : (
            <AddToCartButton product={selectedItem} onAdded={closeItemModal} />
          )}
        </DetailModal>
      )}

      {/* ── Course Detail Modal ───────────────────── */}
      {selectedCourse && (
        <DetailModal
          title={selectedCourse.name}
          categoryLabel="Course"
          imageUrl={null}
          description={null}
          price={null}
          type="course"
          courseName={selectedCourse.name}
          onClose={closeModal}
        >
          <button
            onClick={() => {
              const message = encodeURIComponent(
                `Hi, I'm interested in the ${selectedCourse.name} and would like to know more about it.`
              );
              window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-700/20 border border-green-700/40 text-green-400 hover:bg-green-700/30 hover:border-green-600 transition-all font-sans min-h-[48px]"
          >
            <MessageCircle className="h-5 w-5" />
            Enquire on WhatsApp
          </button>
        </DetailModal>
      )}
    </div>
  );
}

/* ── Add to cart button (used inside modal) ───────────────────────────────── */

function AddToCartButton({ product, onAdded }: { product: Product; onAdded: () => void }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => {
      onAdded();
    }, 1200);
  };

  const inCart = items.find((i) => i.product.id === product.id);

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all font-sans min-h-[48px] ${
        added
          ? 'bg-green-700/20 border-green-700/40 text-green-400'
          : 'border-divine-gold-500/50 text-divine-gold-400 hover:bg-divine-gold-500/10 hover:border-divine-gold-400'
      }`}
    >
      {added ? (
        <>
          <CheckCircle className="h-5 w-5" />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          {inCart ? `Add Another (In Cart: ${inCart.quantity})` : 'Add to Cart'}
        </>
      )}
    </button>
  );
}
