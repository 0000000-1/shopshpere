import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api'; // 💡 Fixed: Importing our custom configured instance

function AdminDashboard() {
  const { user } = useAuth();
  // console.log({user});
  
  // 💡 Fixed: Swapped name to title and added image to align with your MongoDB document schema
  const [form, setForm] = useState({ title: '', price: '', description: '', image: '' });

  // 🛡️ Fail-safe security wrapper: Block rendering entirely if user is a standard guest or buyer
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 font-bold tracking-wide uppercase text-sm mb-2">🛑 Access Denied </p>
        <p className="text-zinc-500 text-sm">Administrative clearing required to access this catalog node.</p>
      </div>
    );
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      // 💡 Fixed: Sends title and image directly to your backend endpoint stream
      await API.post('/products', {
        title: form.title,
        price: Number(form.price),
        description: form.description,
        image: form.image
      });
      
      alert('Product created inside MongoDB collection matrix!');
      setForm({ title: '', price: '', description: '', image: '' }); // Clear form completely
    } catch (err) {
      console.error("Product creation crash logs:", err);
      alert(err?.response?.data?.message || 'Administration update rejected. Confirm token permissions.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-black text-zinc-900 tracking-tight mb-2">Admin Command Module</h1>
        <p className="text-zinc-500 text-xs uppercase tracking-wider mb-6">Database Catalog Updates Panel</p>
        
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Product Title</label>
            <input 
              type="text" required value={form.title}
              className="w-full border p-2.5 rounded-xl bg-zinc-50 text-sm focus:outline-none focus:border-emerald-400"
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Sample Wireless Headphones Air"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Price (USD)</label>
            <input 
              type="number" required value={form.price}
              className="w-full border p-2.5 rounded-xl bg-zinc-50 text-sm focus:outline-none focus:border-emerald-400"
              onChange={e => setForm({ ...form, price: e.target.value })}
              placeholder="99.99"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Image URL</label>
            <input 
              type="url" required value={form.image}
              className="w-full border p-2.5 rounded-xl bg-zinc-50 text-sm focus:outline-none focus:border-emerald-400"
              onChange={e => setForm({ ...form, image: e.target.value })}
              placeholder="https://unsplash.com..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Item Description</label>
            <textarea 
              required rows="3" value={form.description}
              className="w-full border p-2.5 rounded-xl bg-zinc-50 text-sm focus:outline-none focus:border-emerald-400"
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Enter product description details here..."
            />
          </div>
          <button type="submit" className="w-full bg-zinc-900 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl uppercase tracking-wider transition-colors cursor-pointer text-xs">
            Push Product to Database
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboard;
