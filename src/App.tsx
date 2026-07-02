import { useState, createContext, useContext, ReactNode } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import QuickAccessMenu from './components/QuickAccessMenu';
import Cart from './components/Cart';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

type Route = 'home' | 'products' | 'contact' | 'admin' | 'admin-dashboard';

interface NavigationContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
}

function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  return (
    <NavigationContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { navigate } = useNavigation();

  if (loading) {
    return (
      <div className="min-h-screen bg-divine-black flex items-center justify-center">
        <div className="animate-pulse text-divine-gold-400 font-display text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate('admin');
    return null;
  }

  return <>{children}</>;
}

function AppContent() {
  const { currentRoute } = useNavigation();

  if (currentRoute === 'admin') return <AdminLoginPage />;

  if (currentRoute === 'admin-dashboard') {
    return (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    );
  }

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <QuickAccessMenu />
      <Cart />
      <main>
        {currentRoute === 'home' && <HomePage />}
        {currentRoute === 'products' && <ProductsPage />}
        {currentRoute === 'contact' && <ContactPage />}
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
