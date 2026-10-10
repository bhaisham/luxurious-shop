import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatMUR, slugify } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Product, Category } from '@/lib/types';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setProducts((prodRes.data as Product[]) ?? []);
    setCategories(catRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <Loader label="Loading products..." />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Products</h1>
          <p className="mt-1 text-sm text-gray-500">{products.length} total products</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          className="w-full border border-gray-300 py-2.5 pl-9 pr-3 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No products found"
          description={search ? "Try a different search term." : "Add your first product to get started."}
          action={!search ? <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="h-4 w-4" /> Add Product</Button> : undefined}
        />
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-widest text-gray-400">
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 pr-4">SKU</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="border-b border-gray-50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0] ?? ''} alt="" className="h-10 w-8 object-cover bg-ivory" />
                      <div>
                        <p className="font-medium text-charcoal">{product.name}</p>
                        {product.is_sample && <Badge variant="gold">Demo</Badge>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{product.sku ?? '—'}</td>
                  <td className="py-3 pr-4 text-gray-600">{product.category?.name ?? '—'}</td>
                  <td className="py-3 pr-4 font-medium text-charcoal">{formatMUR(product.price)}</td>
                  <td className="py-3 pr-4 text-gray-600">{product.stock_quantity}</td>
                  <td className="py-3 pr-4">
                    {product.availability === 'out_of_stock' || product.stock_quantity <= 0 ? (
                      <Badge variant="out">Out</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(product); setShowForm(true); }} className="text-gray-500 hover:text-gold">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-gray-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

function ProductForm({ product, categories, onClose, onSaved }: ProductFormProps) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    sku: product?.sku ?? '',
    category_id: product?.category_id ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    sale_price: product?.sale_price ?? '',
    images: product?.images.join('\n') ?? '',
    stock_quantity: product?.stock_quantity ?? 0,
    availability: product?.availability ?? 'in_stock',
    is_featured: product?.is_featured ?? false,
    is_new_arrival: product?.is_new_arrival ?? false,
    is_active: product?.is_active ?? true,
    search_keywords: product?.search_keywords ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const images = form.images.split('\n').map(s => s.trim()).filter(Boolean);
    const slug = product?.slug ?? slugify(form.name);
    const data = {
      name: form.name,
      slug,
      sku: form.sku || null,
      category_id: form.category_id || null,
      description: form.description || null,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      images,
      variants: [],
      stock_quantity: Number(form.stock_quantity),
      availability: form.availability,
      is_featured: form.is_featured,
      is_new_arrival: form.is_new_arrival,
      is_active: form.is_active,
      search_keywords: form.search_keywords || null,
      is_sample: product?.is_sample ?? false,
    };

    if (product) {
      const { error } = await supabase.from('products').update(data).eq('id', product.id);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('products').insert(data);
      if (error) { setError(error.message); setSaving(false); return; }
    }

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-charcoal">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-charcoal" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="SKU" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
            <Select label="Category" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <Textarea label="Description" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (Rs) *" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} required />
            <Input label="Sale Price (Rs)" type="number" step="0.01" value={form.sale_price} onChange={e => setForm(f => ({ ...f, sale_price: e.target.value }))} />
          </div>
          <Textarea label="Image URLs (one per line)" rows={3} value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} placeholder="https://..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Stock Quantity" type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: Number(e.target.value) }))} />
            <Select label="Availability" value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))}>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </Select>
          </div>
          <Input label="Search Keywords" value={form.search_keywords} onChange={e => setForm(f => ({ ...f, search_keywords: e.target.value }))} placeholder="comma, separated, keywords" />

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="h-4 w-4 accent-gold" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_new_arrival} onChange={e => setForm(f => ({ ...f, is_new_arrival: e.target.checked }))} className="h-4 w-4 accent-gold" />
              New Arrival
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="h-4 w-4 accent-gold" />
              Active (visible on site)
            </label>
          </div>

          {error && <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={saving}>{product ? 'Save Changes' : 'Add Product'}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
