import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

const emptyForm = { name: '', icon: 'ShoppingBag', description: '', image: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    categoryAPI.list().then((res) => setCategories(res.data.results || res.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, icon: c.icon, description: c.description, image: c.image || '' }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await categoryAPI.update(editing.slug, form);
        toast.success('Category updated!');
      } else {
        await categoryAPI.create(form);
        toast.success('Category created!');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error('Could not save category.');
    }
  };

  const handleDelete = async (c) => {
    if (!confirm(`Delete category "${c.name}"? This will affect its products.`)) return;
    await categoryAPI.delete(c.slug);
    toast.success('Category deleted.');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Category</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-400">Loading...</p> : categories.map((c) => (
          <div key={c.id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-gray-400">{c.product_count} products</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-primary-50 text-primary"><Pencil size={15} /></button>
              <button onClick={() => handleDelete(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="card p-6 w-full max-w-md space-y-3 animate-scaleIn">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button type="button" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <input required placeholder="Category Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-field" />
            <input placeholder="Lucide Icon Name (e.g. Zap, Shirt)" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} className="input-field" />
            <input placeholder="Image URL" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="input-field" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-field" rows={3} />
            <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
