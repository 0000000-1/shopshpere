  import { createContext, useState, useEffect, useContext } from 'react';
  import { loginUser, registerUser } from '../services/api';

  const AuthContext = createContext();

  export function AuthProvider({ children }) {
    // 💡 FIX 1: Initialize state directly from storage so it NEVER resets on redirect/refresh
    const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('userData');
      return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('userData');
      
      if (savedToken && savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null); // Fallback safeguard
      }
      
      // 💡 FIX 2: Only drop loading block once memory evaluation completes
      setLoading(false); 
    }, []);

    const login = async (credentials) => {
      try {
        const res = await loginUser(credentials);
        const { token, user: backendUser } = res.data;

        if (token && backendUser) {
          localStorage.setItem('token', token);
          localStorage.setItem('userData', JSON.stringify(backendUser));
          setUser(backendUser); // Triggers re-render for Navbar immediately
        }
        return res.data;
      } catch (err) {
        console.error('Login failed', err);
        throw err;
      }
    };

    const register = async (payload) => {
      try {
        const res = await registerUser(payload);
        const { token, user: backendUser } = res.data;
        
        if (token && backendUser) {
          localStorage.setItem('token', token);
          localStorage.setItem('userData', JSON.stringify(backendUser));
          setUser(backendUser);
        }
        return res.data;
      } catch (err) {
        console.error('Registration failed', err);
        throw err;
      }
    };

    const logout = () => {   
      localStorage.removeItem('token');
      localStorage.removeItem('userData'); 
      setUser(null);
    };

    return (
      <AuthContext.Provider value={{ user, loading, login, logout, register }}>
        {!loading && children}
      </AuthContext.Provider>
    );
  }

  export const useAuth = () => useContext(AuthContext);
