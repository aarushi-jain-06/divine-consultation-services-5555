import { useState, useEffect } from 'react';
import { useNavigation } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Product, ProductCategory, ProductType, Contact, Testimonial, AboutUs } from '../lib/supabase';
import {
  LogOut, Plus, Edit, Trash2, X, Loader2, AlertCircle, CheckCircle,
  Gem, Star, Moon, Package, Mail, Eye, EyeOff, MessageSquare, Info,
  Check, Ban, Leaf, Compass, Heart, BarChart2, Users, Save, CreditCard, Edit3, Sparkles,
  Wrench,
} from 'lucide-react';

type Tab = 'services' | 'products' | 'contacts' | 'testimonials' | 'about';

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

const SERVICE_CATEGORIES: ProductCategory[] = [
  'vastu', 'visiting_card', 'numerology', 'name_design', 'healings', 'horoscope', 'matchmaking',
];

const PRODUCT_CATEGORIES: ProductCategory[] = ['rudraksh', 'crystals', 'ubtan', 'bath_salts'];

interface ItemFormData {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: ProductCategory;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-4 w-4 ${s <= rating ? 'text-divine-gold-400 fill-divine-gold-400' : 'text-gray-600'}`} />
      ))}
    </div>
  );
}

function ItemGrid({
  items,
  itemType,
  onEdit,
  onDelete,
  actionLoading,
}: {
  items: Product[];
  itemType: ProductType;
  onEdit: (item: Product) => void;
  onDelete: (item: Product) => void;
  actionLoading: string | null;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 mystical-card">
        <Package className="h-12 w-12 text-divine-purple-500 mx-auto mb-4" />
        <p className="text-gray-400 font-body">No {itemType === 'service' ? 'services' : 'products'} yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const cfg = categoryConfig[item.category] ?? { icon: Gem, label: item.category };
        const Icon = cfg.icon;
        return (
          <div key={item.id} className="mystical-card">
            <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-divine-darker">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Icon className="h-10 w-10 text-divine-purple-600/40" />
                  <span className="text-divine-purple-600/30 font-sans text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-divine-purple-400" />
              <span className="text-divine-purple-300 font-sans text-xs uppercase">{cfg.label}</span>
            </div>
            <h3 className="font-display text-lg text-white mb-1 truncate">{item.name}</h3>
            {item.description ? (
              <p className="text-gray-400 font-body text-sm line-clamp-2 mb-3">{item.description}</p>
            ) : (
              <p className="text-divine-purple-600/30 font-body text-sm italic mb-3">No description yet</p>
            )}
            <p className="font-display text-lg text-divine-gold-400 mb-4">
              {item.price != null ? `₹${Number(item.price).toLocaleString('en-IN')}` : (
                <span className="text-divine-purple-400/60 text-sm font-sans">Price not set</span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(item)}
                disabled={actionLoading === item.id}
                className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg border border-divine-purple-600/30 text-divine-purple-300 hover:border-divine-purple-500 hover:text-divine-purple-200 disabled:opacity-50 transition-colors text-sm"
              >
                <Edit className="h-4 w-4 mr-2" />Edit
              </button>
              <button
                onClick={() => onDelete(item)}
                disabled={actionLoading === item.id}
                className="flex items-center justify-center px-3 py-2 rounded-lg border border-red-700/30 text-red-400 hover:border-red-600 hover:text-red-300 disabled:opacity-50 transition-colors"
              >
                {actionLoading === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth();
  const { navigate } = useNavigation();

  const [activeTab, setActiveTab] = useState<Tab>('services');
  const [services, setServices] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Item modal (shared for services & products)
  const [showItemModal, setShowItemModal] = useState(false);
  const [modalItemType, setModalItemType] = useState<ProductType>('service');
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [itemForm, setItemForm] = useState<ItemFormData>({
    name: '', description: '', price: '', image_url: '', category: 'vastu',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Testimonial modal
  const [showTModal, setShowTModal] = useState(false);
  const [editingT, setEditingT] = useState<Testimonial | null>(null);
  const [tName, setTName] = useState('');
  const [tReview, setTReview] = useState('');
  const [tRating, setTRating] = useState(5);
  const [tFormLoading, setTFormLoading] = useState(false);
  const [tFormError, setTFormError] = useState<string | null>(null);

  // About Us
  const [aboutContent, setAboutContent] = useState('');
  const [aboutSaving, setAboutSaving] = useState(false);

  // Contacts
  const [expandedContact, setExpandedContact] = useState<string | null>(null);

  // Testimonials filter
  const [tFilter, setTFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    if (!user) { navigate('admin'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [allRes, contactRes, testRes, aboutRes] = await Promise.all([
        supabase.from('products').select('*').order('sort_order', { ascending: true }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('about_us').select('*').maybeSingle(),
      ]);
      if (allRes.error) throw allRes.error;
      if (contactRes.error) throw contactRes.error;
      if (testRes.error) throw testRes.error;
      const all = allRes.data || [];
      setServices(all.filter((p) => p.type === 'service'));
      setProducts(all.filter((p) => p.type === 'product'));
      setContacts(contactRes.data || []);
      setTestimonials(testRes.data || []);
      if (aboutRes.data) { setAboutUs(aboutRes.data); setAboutContent(aboutRes.data.content); }
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  const handleSignOut = async () => { await signOut(); navigate('admin'); };

  // ── Item CRUD ────────────────────────────────────────────────────────────────

  const openAddItem = (type: ProductType) => {
    setModalItemType(type);
    setEditingItem(null);
    setItemForm({
      name: '', description: '', price: '', image_url: '',
      category: type === 'service' ? 'vastu' : 'rudraksh',
    });
    setFormError(null);
    setShowItemModal(true);
  };

  const openEditItem = (item: Product) => {
    setModalItemType(item.type);
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description || '',
      price: item.price != null ? item.price.toString() : '',
      image_url: item.image_url || '',
      category: item.category,
    });
    setFormError(null);
    setShowItemModal(true);
  };

  const closeItemModal = () => { setShowItemModal(false); setEditingItem(null); setFormError(null); };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!itemForm.name.trim()) { setFormError('Name is required.'); return; }
    const priceVal = itemForm.price.trim() === '' ? null : parseFloat(itemForm.price);
    if (itemForm.price.trim() !== '' && (priceVal === null || isNaN(priceVal) || priceVal < 0)) {
      setFormError('Please enter a valid price or leave it blank.');
      return;
    }
    try {
      setFormLoading(true);
      const data = {
        name: itemForm.name.trim(),
        description: itemForm.description.trim(),
        price: priceVal,
        image_url: itemForm.image_url.trim() || null,
        category: itemForm.category,
        type: modalItemType,
      };
      const { error } = editingItem
        ? await supabase.from('products').update(data).eq('id', editingItem.id)
        : await supabase.from('products').insert({ ...data, sort_order: 99 });
      if (error) throw error;
      showSuccess(editingItem ? 'Updated successfully!' : 'Added successfully!');
      closeItemModal();
      fetchAll();
    } catch (err) {
      console.error(err);
      setFormError('Failed to save. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const deleteItem = async (item: Product) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      setActionLoading(item.id);
      const { error } = await supabase.from('products').delete().eq('id', item.id);
      if (error) throw error;
      if (item.type === 'service') setServices((p) => p.filter((x) => x.id !== item.id));
      else setProducts((p) => p.filter((x) => x.id !== item.id));
      showSuccess('Deleted.');
    } catch (err) {
      console.error(err);
      setError('Failed to delete.');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Testimonials ────────────────────────────────────────────────────────────

  const openAddT = () => {
    setEditingT(null); setTName(''); setTReview(''); setTRating(5); setTFormError(null); setShowTModal(true);
  };
  const openEditT = (t: Testimonial) => {
    setEditingT(t); setTName(t.name); setTReview(t.review); setTRating(t.rating); setTFormError(null); setShowTModal(true);
  };
  const closeTModal = () => { setShowTModal(false); setEditingT(null); setTFormError(null); };

  const handleTSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTFormError(null);
    if (!tName.trim() || !tReview.trim()) { setTFormError('Fill in name and review.'); return; }
    try {
      setTFormLoading(true);
      const data = { name: tName.trim(), review: tReview.trim(), rating: tRating, approved: true };
      const { error } = editingT
        ? await supabase.from('testimonials').update(data).eq('id', editingT.id)
        : await supabase.from('testimonials').insert(data);
      if (error) throw error;
      showSuccess(editingT ? 'Updated!' : 'Added!');
      closeTModal();
      fetchAll();
    } catch (err) { console.error(err); setTFormError('Failed to save.'); }
    finally { setTFormLoading(false); }
  };

  const toggleApproval = async (t: Testimonial) => {
    try {
      setActionLoading(t.id);
      const { error } = await supabase.from('testimonials').update({ approved: !t.approved }).eq('id', t.id);
      if (error) throw error;
      setTestimonials((prev) => prev.map((x) => x.id === t.id ? { ...x, approved: !x.approved } : x));
      showSuccess(t.approved ? 'Rejected.' : 'Approved!');
    } catch (err) { console.error(err); setError('Failed to update.'); }
    finally { setActionLoading(null); }
  };

  const deleteT = async (t: Testimonial) => {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    try {
      setActionLoading(t.id);
      const { error } = await supabase.from('testimonials').delete().eq('id', t.id);
      if (error) throw error;
      setTestimonials((prev) => prev.filter((x) => x.id !== t.id));
      showSuccess('Deleted.');
    } catch (err) { console.error(err); setError('Failed to delete.'); }
    finally { setActionLoading(null); }
  };

  // ── About Us ─────────────────────────────────────────────────────────────────

  const saveAboutUs = async () => {
    try {
      setAboutSaving(true);
      let error;
      if (aboutUs) {
        ({ error } = await supabase.from('about_us').update({ content: aboutContent, updated_at: new Date().toISOString() }).eq('id', aboutUs.id));
      } else {
        ({ error } = await supabase.from('about_us').insert({ content: aboutContent }));
      }
      if (error) throw error;
      showSuccess('About Us saved!');
      fetchAll();
    } catch (err) { console.error(err); setError('Failed to save About Us.'); }
    finally { setAboutSaving(false); }
  };

  const filteredT = testimonials.filter((t) => {
    if (tFilter === 'pending') return !t.approved;
    if (tFilter === 'approved') return t.approved;
    return true;
  });
  const pendingCount = testimonials.filter((t) => !t.approved).length;

  const availableCategories = modalItemType === 'service' ? SERVICE_CATEGORIES : PRODUCT_CATEGORIES;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-divine-black">
      {/* Header */}
      <header className="bg-divine-darker border-b border-divine-purple-700/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/dcs_logo copy.jpeg" alt="DCS" className="h-8 w-8 rounded object-contain" />
              <div>
                <h1 className="font-display text-lg text-divine-gold-400">Admin Dashboard</h1>
                <p className="text-gray-500 text-xs font-sans">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('home')} className="text-gray-400 hover:text-white text-sm font-sans hidden sm:block">View Site</button>
              <button onClick={handleSignOut} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="font-sans text-sm hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-red-900/20 border border-red-700/30 text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-sans text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-green-900/20 border border-green-700/30 text-green-400">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p className="font-sans text-sm flex-1">{success}</p>
            <button onClick={() => setSuccess(null)}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 border-b border-divine-purple-700/30">
          {([
            { key: 'services' as Tab, label: 'Services', icon: Wrench, count: services.length },
            { key: 'products' as Tab, label: 'Products', icon: Package, count: products.length },
            { key: 'contacts' as Tab, label: 'Contacts', icon: Mail, count: contacts.length },
            { key: 'testimonials' as Tab, label: 'Testimonials', icon: MessageSquare, count: testimonials.length, badge: pendingCount },
            { key: 'about' as Tab, label: 'About Us', icon: Info },
          ]).map(({ key, label, icon: Icon, count, badge }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors text-sm whitespace-nowrap ${
                activeTab === key
                  ? 'border-divine-gold-400 text-divine-gold-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-sans">{label}</span>
              {count !== undefined && (
                <span className="bg-divine-purple-700/50 text-gray-300 text-xs px-2 py-0.5 rounded-full">{count}</span>
              )}
              {badge !== undefined && badge > 0 && (
                <span className="bg-amber-500/80 text-divine-black text-xs px-1.5 py-0.5 rounded-full font-bold">{badge}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-divine-gold-400 animate-spin" />
          </div>
        ) : activeTab === 'services' ? (
          /* ── Services ──────────────────────────── */
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display text-xl text-white">Manage Services</h2>
                <p className="text-gray-500 font-sans text-sm">Edit descriptions, images and pricing for each service</p>
              </div>
              <button onClick={() => openAddItem('service')} className="mystical-button flex items-center gap-2">
                <Plus className="h-5 w-5" />Add Service
              </button>
            </div>
            <ItemGrid items={services} itemType="service" onEdit={openEditItem} onDelete={deleteItem} actionLoading={actionLoading} />
          </div>
        ) : activeTab === 'products' ? (
          /* ── Products ──────────────────────────── */
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display text-xl text-white">Manage Products</h2>
                <p className="text-gray-500 font-sans text-sm">Edit descriptions, images and pricing for each product</p>
              </div>
              <button onClick={() => openAddItem('product')} className="mystical-button flex items-center gap-2">
                <Plus className="h-5 w-5" />Add Product
              </button>
            </div>
            <ItemGrid items={products} itemType="product" onEdit={openEditItem} onDelete={deleteItem} actionLoading={actionLoading} />
          </div>
        ) : activeTab === 'contacts' ? (
          /* ── Contacts ──────────────────────────── */
          <div>
            <h2 className="font-display text-xl text-white mb-6">Contact Form Submissions</h2>
            {contacts.length === 0 ? (
              <div className="text-center py-12 mystical-card">
                <Mail className="h-12 w-12 text-divine-purple-500 mx-auto mb-4" />
                <p className="text-gray-400 font-body">No contact submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="mystical-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display text-lg text-white">{contact.name}</h3>
                          <span className="text-gray-500 text-xs font-sans">{new Date(contact.created_at).toLocaleDateString()}</span>
                        </div>
                        <a href={`mailto:${contact.email}`} className="text-divine-gold-400 hover:text-divine-gold-300 text-sm font-sans">{contact.email}</a>
                      </div>
                      <button onClick={() => setExpandedContact(expandedContact === contact.id ? null : contact.id)} className="text-gray-400 hover:text-white transition-colors ml-4">
                        {expandedContact === contact.id ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {expandedContact === contact.id && (
                      <div className="mt-4 pt-4 border-t border-divine-purple-700/30">
                        <p className="text-gray-300 font-body whitespace-pre-wrap">{contact.message}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'testimonials' ? (
          /* ── Testimonials ──────────────────────── */
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="font-display text-xl text-white">Manage Testimonials</h2>
                {pendingCount > 0 && <p className="text-amber-400 font-sans text-sm mt-1">{pendingCount} pending approval</p>}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex rounded-lg overflow-hidden border border-divine-purple-700/30">
                  {(['all', 'pending', 'approved'] as const).map((f) => (
                    <button key={f} onClick={() => setTFilter(f)}
                      className={`px-3 py-1.5 text-xs font-sans capitalize transition-colors ${tFilter === f ? 'bg-divine-purple-700 text-white' : 'text-gray-400 hover:text-white'}`}
                    >{f}</button>
                  ))}
                </div>
                <button onClick={openAddT} className="mystical-button flex items-center gap-2 text-sm">
                  <Plus className="h-4 w-4" />Add
                </button>
              </div>
            </div>
            {filteredT.length === 0 ? (
              <div className="text-center py-12 mystical-card">
                <MessageSquare className="h-12 w-12 text-divine-purple-500 mx-auto mb-4" />
                <p className="text-gray-400 font-body">No testimonials {tFilter !== 'all' ? `(${tFilter})` : ''} yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredT.map((t) => (
                  <div key={t.id} className={`mystical-card ${!t.approved ? 'border-amber-500/20 bg-amber-900/5' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-white">{t.name}</span>
                          <span className={`text-xs font-sans px-2 py-0.5 rounded-full ${t.approved ? 'bg-green-900/30 text-green-400 border border-green-700/30' : 'bg-amber-900/30 text-amber-400 border border-amber-700/30'}`}>
                            {t.approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs font-sans">{new Date(t.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button onClick={() => toggleApproval(t)} disabled={actionLoading === t.id}
                          className={`p-1.5 rounded transition-colors ${t.approved ? 'text-amber-400 hover:bg-amber-900/20' : 'text-green-400 hover:bg-green-900/20'}`}
                          title={t.approved ? 'Reject' : 'Approve'}
                        >
                          {actionLoading === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : t.approved ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </button>
                        <button onClick={() => openEditT(t)} className="p-1.5 rounded text-divine-purple-300 hover:bg-divine-purple-900/20 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteT(t)} disabled={actionLoading === t.id} className="p-1.5 rounded text-red-400 hover:bg-red-900/20 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mb-2"><StarDisplay rating={t.rating} /></div>
                    <p className="text-gray-300 font-body text-sm italic">"{t.review}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── About Us ──────────────────────────── */
          <div className="max-w-2xl">
            <h2 className="font-display text-xl text-white mb-6">Edit About Us</h2>
            <div className="mystical-card">
              <p className="text-gray-400 font-body text-sm mb-4">This text appears in the "About Us" section on the homepage.</p>
              <textarea
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                rows={12}
                className="mystical-input resize-y w-full mb-4"
                placeholder="Write about your story, mission, and values..."
              />
              <button onClick={saveAboutUs} disabled={aboutSaving} className="mystical-button flex items-center gap-2 disabled:opacity-70">
                {aboutSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {aboutSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-divine-black/80 backdrop-blur-sm" onClick={closeItemModal} />
          <div className="relative w-full max-w-lg mystical-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-divine-gold-400">
                {editingItem ? `Edit ${modalItemType === 'service' ? 'Service' : 'Product'}` : `Add ${modalItemType === 'service' ? 'Service' : 'Product'}`}
              </h2>
              <button onClick={closeItemModal} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
            </div>

            <form onSubmit={handleItemSubmit} className="space-y-5">
              <div>
                <label className="block font-body text-gray-300 mb-2">Name <span className="text-red-400">*</span></label>
                <input type="text" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="mystical-input" placeholder="Name" disabled={formLoading} />
              </div>
              <div>
                <label className="block font-body text-gray-300 mb-2">Category</label>
                <select value={itemForm.category} onChange={(e) => setItemForm({ ...itemForm, category: e.target.value as ProductCategory })}
                  className="mystical-input" disabled={formLoading}>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>{categoryConfig[cat]?.label ?? cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body text-gray-300 mb-2">Description</label>
                <textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="mystical-input resize-none" rows={4} placeholder="Description (leave blank if not ready)" disabled={formLoading} />
              </div>
              <div>
                <label className="block font-body text-gray-300 mb-2">Price (₹) <span className="text-gray-500 text-xs">— leave blank if not set yet</span></label>
                <input type="number" step="1" min="0" value={itemForm.price}
                  onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                  className="mystical-input" placeholder="Leave blank or enter price" disabled={formLoading} />
              </div>
              <div>
                <label className="block font-body text-gray-300 mb-2">Image URL <span className="text-gray-500 text-xs">— leave blank if not ready</span></label>
                <input type="url" value={itemForm.image_url} onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
                  className="mystical-input" placeholder="https://example.com/image.jpg" disabled={formLoading} />
              </div>
              {formError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" /><span>{formError}</span>
                </div>
              )}
              <div className="flex gap-4">
                <button type="button" onClick={closeItemModal} disabled={formLoading} className="flex-1 mystical-button-outline">Cancel</button>
                <button type="submit" disabled={formLoading} className="flex-1 mystical-button flex items-center justify-center gap-2 disabled:opacity-70">
                  {formLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {showTModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-divine-black/80 backdrop-blur-sm" onClick={closeTModal} />
          <div className="relative w-full max-w-lg mystical-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-divine-gold-400">{editingT ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={closeTModal} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleTSubmit} className="space-y-5">
              <div>
                <label className="block font-body text-gray-300 mb-2">Name <span className="text-red-400">*</span></label>
                <input type="text" value={tName} onChange={(e) => setTName(e.target.value)}
                  className="mystical-input" placeholder="Customer name" disabled={tFormLoading} />
              </div>
              <div>
                <label className="block font-body text-gray-300 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setTRating(s)}>
                      <Star className={`h-6 w-6 transition-colors ${s <= tRating ? 'text-divine-gold-400 fill-divine-gold-400' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-body text-gray-300 mb-2">Review <span className="text-red-400">*</span></label>
                <textarea value={tReview} onChange={(e) => setTReview(e.target.value)}
                  className="mystical-input resize-none" rows={4} placeholder="Customer review..." disabled={tFormLoading} />
              </div>
              {tFormError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" /><span>{tFormError}</span>
                </div>
              )}
              <div className="flex gap-4">
                <button type="button" onClick={closeTModal} disabled={tFormLoading} className="flex-1 mystical-button-outline">Cancel</button>
                <button type="submit" disabled={tFormLoading} className="flex-1 mystical-button flex items-center justify-center gap-2 disabled:opacity-70">
                  {tFormLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  {editingT ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
