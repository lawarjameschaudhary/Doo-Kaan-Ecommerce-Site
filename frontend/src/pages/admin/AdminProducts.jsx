import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { productAPI, categoryAPI } from '../../services/api';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '', category: '', brand: '', description: '', price: '', discount_price: '',
  thumbnail: '', stock: '', is_featured: false, is_trending: false, is_flash_sale: false, is_best_seller: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadProducts = () => {
    setLoading(true);
    productAPI.list({ search: search || undefined, page_size: 100 })
      .then((res) => setProducts(res.data.results))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, [search]);
  useEffect(() => { categoryAPI.list().then((res) => setCategories(res.data.results || res.data)); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, category: p.category, brand: p.brand, description: p.description || '',
      price: p.price, discount_price: p.discount_price || '', thumbnail: p.thumbnail, stock: p.stock,
      is_featured: p.is_featured, is_trending: p.is_trending, is_flash_sale: p.is_flash_sale, is_best_seller: p.is_best_seller,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, discount_price: form.discount_price || null };
    try {
      if (editing) {
        await productAPI.update(editing.slug, payload);
        toast.success('Product updated!');
      } else {
        await productAPI.create(payload);
        toast.success('Product created!');
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error('Could not save product. Check required fields.');
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await productAPI.delete(p.slug);
    toast.success('Product deleted.');
    loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-9 text-sm" />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr className="text-left text-gray-500">
              <th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="border-t border-gray-50 dark:border-gray-800">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <span className="font-medium line-clamp-1">{p.name}</span>
                </td>
                <td className="p-3">{p.category_name}</td>
                <td className="p-3">{formatPrice(p.discount_price || p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-primary-50 text-primary"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-3 animate-scaleIn">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button type="button" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <input required placeholder="Product Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-field" />
            <select required value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input-field">
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Brand" value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} className="input-field" />
            <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-field" rows={3} />
            <input required placeholder="Image URL" value={form.thumbnail} onChange={(e) => setForm((p) => ({ ...p, thumbnail: e.target.value }))} className="input-field" />
            <div className="grid grid-cols-3 gap-2">
              <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="input-field" />
              <input type="number" placeholder="Discount Price" value={form.discount_price} onChange={(e) => setForm((p) => ({ ...p, discount_price: e.target.value }))} className="input-field" />
              <input required type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[['is_featured', 'Featured'], ['is_trending', 'Trending'], ['is_flash_sale', 'Flash Sale'], ['is_best_seller', 'Best Seller']].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input type="checkbox" checked={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))} className="accent-primary" />
                  {label}
                </label>
              ))}
            </div>
            <button type="submit" className="btn-primary w-full">{editing ? 'Update Product' : 'Create Product'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
