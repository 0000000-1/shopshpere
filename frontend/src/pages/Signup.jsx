import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate('/login')
  }
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Full name" className="w-full p-3 border rounded" />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email" className="w-full p-3 border rounded" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" className="w-full p-3 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-white py-2 rounded">{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      <div className="mt-4 text-center"><button type="button" onClick={handleLogin} className="text-sm text-emerald-600 hover:underline"> Already have an account? Login</button></div>
    </div>
  );
}

export default Signup;
