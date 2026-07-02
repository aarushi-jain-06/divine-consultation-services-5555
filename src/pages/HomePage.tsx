import { useState, useEffect } from 'react';
import { useNavigation } from '../App';
import { supabase, Testimonial, AboutUs } from '../lib/supabase';
import {
  Sparkles,
  Moon,
  Star,
  Gem,
  ArrowRight,
  Calendar,
  Loader2,
  Send,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

function StarRating({ rating, interactive = false, onChange }: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          tabIndex={interactive ? 0 : -1}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              star <= (hovered || rating)
                ? 'text-divine-gold-400 fill-divine-gold-400'
                : 'text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { navigate } = useNavigation();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);

  // Testimonial form state
  const [tName, setTName] = useState('');
  const [tReview, setTReview] = useState('');
  const [tRating, setTRating] = useState(5);
  const [tStatus, setTStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tError, setTError] = useState('');

  useEffect(() => {
    fetchTestimonials();
    fetchAboutUs();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setTestimonialsLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const fetchAboutUs = async () => {
    try {
      const { data } = await supabase.from('about_us').select('*').maybeSingle();
      if (data) setAboutUs(data);
    } catch (err) {
      console.error('Error fetching about us:', err);
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTError('');

    if (!tName.trim() || !tReview.trim()) {
      setTError('Please fill in your name and review.');
      setTStatus('error');
      return;
    }

    try {
      setTStatus('loading');
      const { error } = await supabase.from('testimonials').insert({
        name: tName.trim(),
        review: tReview.trim(),
        rating: tRating,
        approved: false,
      });
      if (error) throw error;
      setTStatus('success');
      setTName('');
      setTReview('');
      setTRating(5);
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      setTError('Failed to submit. Please try again.');
      setTStatus('error');
    }
  };

  const features = [
    {
      icon: Gem,
      title: 'Crystals & Gemstones',
      description: 'Hand-selected crystals from around the world, each imbued with unique energetic properties.',
    },
    {
      icon: Star,
      title: 'Numerology Readings',
      description: 'Unlock the secrets hidden in your numbers with personalized numerology consultations.',
    },
    {
      icon: Moon,
      title: 'Spiritual Consultations',
      description: 'One-on-one guidance sessions to help you navigate life\'s spiritual journey.',
    },
  ];

  return (
    <div className="min-h-screen bg-divine-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 mystical-gradient" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-divine-black/50 to-divine-black" />

        <div className="absolute top-20 left-10 w-2 h-2 bg-divine-gold-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-divine-purple-400 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-divine-gold-300 rounded-full animate-pulse delay-500" />
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-divine-purple-500/50 rounded-full animate-float" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 flex justify-center">
            <img
              src="/images/dcs_logo copy.jpeg"
              alt="Divine Consultation Services5555"
              className="h-24 w-24 md:h-28 md:w-28 rounded-2xl object-contain animate-glow shadow-2xl shadow-divine-purple-500/30"
            />
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 text-shadow-mystical leading-tight">
            Divine Consultation
            <span className="block text-gold-gradient mt-2">Services5555</span>
          </h1>

          <p className="font-body text-xl md:text-2xl text-divine-purple-200/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Embark on a transformative journey through the mystical arts.
            Discover ancient wisdom, healing crystals, and personalized spiritual guidance.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://calendly.com/ruchijainhzb/consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="mystical-button inline-flex items-center justify-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              Book Consultation
            </a>
            <button
              onClick={() => navigate('products')}
              className="mystical-button-outline inline-flex items-center justify-center"
            >
              Explore Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-divine-purple-400/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-divine-gold-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Sacred offerings to guide you on your spiritual path
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="mystical-card group cursor-pointer text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-divine-purple-900/50 border border-divine-purple-600/30 flex items-center justify-center group-hover:border-divine-gold-500/50 transition-colors">
                  <feature.icon className="h-8 w-8 text-divine-gold-400 group-hover:animate-pulse" />
                </div>
                <h3 className="font-display text-xl text-divine-gold-400 mb-3">{feature.title}</h3>
                <p className="text-gray-400 font-body leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('products')}
              className="inline-flex items-center text-divine-gold-400 hover:text-divine-gold-300 font-display transition-colors"
            >
              View All Offerings
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 md:py-32 bg-divine-darker/50 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">About Us</h2>
          </div>
          <div className="max-w-3xl mx-auto mystical-card text-center">
            <Sparkles className="h-10 w-10 text-divine-gold-400 mx-auto mb-4" />
            {aboutUs?.content ? (
              <p className="text-gray-300 font-body text-lg leading-relaxed whitespace-pre-wrap">
                {aboutUs.content}
              </p>
            ) : (
              <p className="text-divine-purple-600/40 font-body text-sm italic">
                About us content coming soon...
              </p>
            )}

            <div className="mt-8 flex justify-center gap-12">
              <div className="text-center">
                <div className="font-display text-4xl text-divine-gold-400 text-shadow-gold">15+</div>
                <div className="text-gray-400 font-body text-sm">Years Experience</div>
              </div>
              <div className="w-px bg-divine-purple-700/50" />
              <div className="text-center">
                <div className="font-display text-4xl text-divine-gold-400 text-shadow-gold">500+</div>
                <div className="text-gray-400 font-body text-sm">Happy Clients</div>
              </div>
              <div className="w-px bg-divine-purple-700/50" />
              <div className="text-center">
                <div className="font-display text-4xl text-divine-gold-400 text-shadow-gold">100+</div>
                <div className="text-gray-400 font-body text-sm">Unique Crystals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 relative overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-divine-black via-divine-purple-900/10 to-divine-black" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Client Testimonials</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Words from those who have experienced our services
            </p>
          </div>

          {/* Approved testimonials */}
          {testimonialsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-divine-gold-400 animate-spin" />
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {testimonials.map((t) => (
                <div key={t.id} className="mystical-card relative">
                  <StarRating rating={t.rating} />
                  <p className="text-gray-300 font-body italic leading-relaxed my-4">
                    "{t.review}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-divine-purple-700/50 flex items-center justify-center">
                      <span className="text-divine-gold-400 font-display">
                        {t.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="ml-3 text-divine-gold-400 font-body">{t.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Submit testimonial form */}
          <div className="max-w-lg mx-auto">
            <div className="mystical-card">
              <h3 className="font-display text-xl text-divine-gold-400 mb-4 text-center">
                Share Your Experience
              </h3>

              {tStatus === 'success' ? (
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-900/20 border border-green-700/30 text-green-400">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="font-body text-sm">
                    Thank you! Your testimonial has been submitted for review.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                  <div>
                    <label className="block font-body text-gray-300 mb-2 text-sm">Your Name</label>
                    <input
                      type="text"
                      value={tName}
                      onChange={(e) => setTName(e.target.value)}
                      placeholder="Enter your name"
                      className="mystical-input"
                      disabled={tStatus === 'loading'}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-gray-300 mb-2 text-sm">Rating</label>
                    <StarRating rating={tRating} interactive onChange={setTRating} />
                  </div>
                  <div>
                    <label className="block font-body text-gray-300 mb-2 text-sm">Your Review</label>
                    <textarea
                      value={tReview}
                      onChange={(e) => setTReview(e.target.value)}
                      placeholder="Share your experience..."
                      rows={4}
                      className="mystical-input resize-none"
                      disabled={tStatus === 'loading'}
                    />
                  </div>
                  {tStatus === 'error' && (
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{tError}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={tStatus === 'loading'}
                    className="mystical-button w-full flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {tStatus === 'loading' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-divine-darker/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Moon className="h-12 w-12 text-divine-gold-400 mx-auto mb-6 animate-pulse" />
          <h2 className="section-title">Begin Your Journey</h2>
          <p className="section-subtitle mb-8 max-w-2xl mx-auto">
            Ready to explore the mysteries that await? Connect with us today and take the first step toward enlightenment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://calendly.com/ruchijainhzb/consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="mystical-button inline-flex items-center justify-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              Book a Consultation
            </a>
            <button
              onClick={() => navigate('contact')}
              className="mystical-button-outline inline-flex items-center justify-center"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
