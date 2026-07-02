import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Mail,
  Phone,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Copy,
  Check,
  Smartphone,
} from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const UPI_ID = '7520573831-2@ybl';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [upiCopied, setUpiCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in all fields.');
      setStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      setErrorMessage('');

      const { error } = await supabase.from('contacts').insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      if (error) throw error;

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');

      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setErrorMessage('Failed to send message. Please try again later.');
      setStatus('error');
    }
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      // fallback — select the text manually
    }
  };

  return (
    <div className="min-h-screen bg-divine-black pt-28 pb-20">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-divine-purple-900/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="h-12 w-12 text-divine-gold-400 mx-auto mb-4" />
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Reach out to begin your spiritual journey or inquire about our services
          </p>

          {/* Calendly CTA */}
          <div className="mt-8">
            <a
              href="https://calendly.com/ruchijainhzb/consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="mystical-button inline-flex items-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              Book a Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="mystical-card">
            <h2 className="font-display text-2xl text-divine-gold-400 mb-6">
              Send Us a Message
            </h2>

            {status === 'success' ? (
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-900/20 border border-green-700/30 text-green-400">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <p className="font-body">
                  Thank you for your message! We will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block font-body text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mystical-input"
                    disabled={status === 'loading'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-body text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mystical-input"
                    disabled={status === 'loading'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-body text-gray-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help you on your spiritual journey..."
                    rows={5}
                    className="mystical-input resize-none"
                    disabled={status === 'loading'}
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-red-900/20 border border-red-700/30 text-red-400">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="font-body text-sm">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="mystical-button w-full flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Email */}
            <div className="mystical-card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-divine-purple-900/50 border border-divine-purple-700/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-divine-gold-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-white mb-1">Email Us</h3>
                  <p className="text-gray-400 font-body text-sm mb-2">
                    For general inquiries and consultations
                  </p>
                  <a
                    href="mailto:ruchijainhzb@gmail.com"
                    className="text-divine-gold-400 hover:text-divine-gold-300 transition-colors font-body"
                  >
                    ruchijainhzb@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="mystical-card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-divine-purple-900/50 border border-divine-purple-700/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-divine-gold-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-white mb-1">Call Us</h3>
                  <a
                    href="tel:7520573831"
                    className="text-divine-gold-400 hover:text-divine-gold-300 transition-colors font-body"
                  >
                    +91 7520573831
                  </a>
                </div>
              </div>
            </div>

            {/* Session Information */}
            <div className="mystical-card bg-divine-purple-900/20 border-divine-purple-600/30">
              <h3 className="font-display text-lg text-divine-gold-400 mb-3">
                Session Information
              </h3>
              <ul className="space-y-2 text-gray-400 font-body text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-divine-gold-500 mt-0.5">✦</span>
                  Consultations available in-person and virtually
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-divine-gold-500 mt-0.5">✦</span>
                  Crystal purchases include complimentary cleansing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-divine-gold-500 mt-0.5">✦</span>
                  Detailed Numerology readings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-divine-gold-500 mt-0.5">✦</span>
                  Site visit for Vastu (available if required)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-divine-gold-500 mt-0.5">✦</span>
                  Online / Offline Healings
                </li>
              </ul>
            </div>

            {/* Book Consultation */}
            <div className="mystical-card border-divine-gold-500/20 bg-divine-gold-900/10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-divine-gold-900/30 border border-divine-gold-700/30 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-divine-gold-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-white mb-1">Book a Session</h3>
                  <p className="text-gray-400 font-body text-sm mb-3">
                    Schedule your consultation directly via Calendly
                  </p>
                  <a
                    href="https://calendly.com/ruchijainhzb/consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mystical-button inline-flex items-center gap-2 text-sm"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mystical-card max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-divine-purple-900/50 border border-divine-purple-700/30 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="h-6 w-6 text-divine-gold-400" />
            </div>
            <h2 className="font-display text-2xl text-divine-gold-400">Pay via UPI</h2>
            <p className="text-gray-400 font-body text-sm mt-1">
              Scan the QR code or use the UPI ID below to make a payment
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
            {/* PhonePe QR */}
            <div className="text-center">
              <div className="inline-block p-3 bg-white rounded-xl shadow-lg">
                <img
                  src="/images/dcs_QR copy.jpeg"
                  alt="PhonePe Payment QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <p className="text-gray-500 font-sans text-xs mt-2">Scan with any UPI app</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="text-gray-400 font-body text-sm">— or pay using UPI ID —</div>
              {/* UPI ID Copy */}
              <div className="flex items-center gap-3 bg-divine-darker/80 border border-divine-purple-700/30 rounded-lg px-4 py-3">
                <span className="font-mono text-divine-gold-400 text-sm select-all">{UPI_ID}</span>
                <button
                  onClick={copyUpi}
                  className="text-gray-400 hover:text-divine-gold-400 transition-colors flex-shrink-0"
                  aria-label="Copy UPI ID"
                >
                  {upiCopied ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
              {upiCopied && (
                <p className="text-green-400 font-sans text-xs">Copied to clipboard!</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
