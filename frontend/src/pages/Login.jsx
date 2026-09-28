import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UsersHints from '../components/UsersHints';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Destructure both login and register methods from your AuthContext
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Triggers your existing login flow
      await login({ email, password });
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || `failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault()
    navigate('/signup');
  }
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      {/* Title changes dynamically based on active state */}
      <h2 className="text-2xl font-bold mb-4">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="Email Address"
          className="w-full p-3 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {/* Interactive Toggle Button */}
      <div className="mt-4 text-center mb-4">
        <button
          type="button"
          onClick={handleSignup}
          className="text-sm text-emerald-600 hover:underline">
          Don't have an account? Sign Up
        </button>
      </div>
<UsersHints/>
    </div>
  );
}

export default Login;
