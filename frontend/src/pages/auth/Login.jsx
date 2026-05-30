import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      setAuth({ email }, response.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      alert('Giriş başarısız');
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-surface-card">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-card rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Giriş Yap</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-secondary">E-posta</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-secondary">Şifre</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">Giriş</button>
      </form>
    </div>
  );
};

export default Login;
