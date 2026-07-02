import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';

const WA_NUMBER = '917520573831';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  const openWhatsApp = () => {
    if (items.length === 0) return;

    const lines = items.map((item) => {
      const price = item.product.price != null
        ? `₹${Number(item.product.price).toLocaleString('en-IN')}`
        : 'Price TBD';
      return `• ${item.product.name} x${item.quantity} — ${price}`;
    });

    const total = totalPrice > 0
      ? `\nTotal: ₹${totalPrice.toLocaleString('en-IN')}`
      : '';

    const message = encodeURIComponent(
      `Hi! I'd like to place an order:\n\n${lines.join('\n')}${total}\n\nPlease confirm my order.`
    );

    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
    clearCart();
    setIsOpen(false);
  };

  if (totalItems === 0 && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-divine-dark/90 border border-divine-purple-700/40 rounded-full flex items-center justify-center text-gray-500 cursor-default"
        aria-label="Cart is empty"
      >
        <ShoppingCart className="h-6 w-6" />
      </button>
    );
  }

  return (
    <>
      {/* Cart Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-divine-purple-700 border-2 border-divine-gold-400/60 rounded-full flex items-center justify-center shadow-lg shadow-divine-purple-500/40 transition-all hover:scale-110 hover:border-divine-gold-400"
        aria-label={`Open cart (${totalItems} items)`}
      >
        <ShoppingCart className="h-6 w-6 text-white" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-divine-gold-400 text-divine-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-divine-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-sm bg-divine-darker border-l border-divine-purple-700/30 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-divine-purple-700/30">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-divine-gold-400" />
                <h2 className="font-display text-lg text-divine-gold-400">Your Cart</h2>
                {totalItems > 0 && (
                  <span className="bg-divine-purple-700/50 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {totalItems} item{totalItems !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-divine-purple-700/50 mx-auto mb-3" />
                  <p className="text-gray-500 font-body">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 bg-divine-dark/60 border border-divine-purple-700/20 rounded-lg p-3"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-divine-darker flex-shrink-0">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-divine-purple-600/40" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-white text-sm truncate">{item.product.name}</p>
                      <p className="font-display text-divine-gold-400 text-sm">
                        {item.product.price != null
                          ? `₹${Number(item.product.price).toLocaleString('en-IN')}`
                          : 'Contact for price'}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded flex items-center justify-center border border-divine-purple-700/40 text-gray-300 hover:border-divine-gold-500/50 hover:text-divine-gold-400 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-white font-sans text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded flex items-center justify-center border border-divine-purple-700/40 text-gray-300 hover:border-divine-gold-500/50 hover:text-divine-gold-400 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-1 w-7 h-7 rounded flex items-center justify-center text-red-500/70 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-divine-purple-700/30 space-y-4">
                {totalPrice > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="font-body text-gray-400">Total</span>
                    <span className="font-display text-xl text-divine-gold-400">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <button
                  onClick={openWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-display py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Place Order via WhatsApp
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-gray-500 hover:text-red-400 text-sm font-sans transition-colors"
                >
                  Clear cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
