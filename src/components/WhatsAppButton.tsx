import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://whatsapp.com/channel/0029VaXYBWxGufInXXS4gw1F"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 group"
      aria-label="Join our WhatsApp Channel"
    >
      <MessageCircle className="h-7 w-7 group-hover:animate-pulse" />
      <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-divine-dark/95 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans border border-divine-purple-700/30">
        WhatsApp Channel
      </span>
    </a>
  );
}
