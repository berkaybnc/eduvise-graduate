import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const Register = () => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate('/login');
    } catch (error) {
      alert('Kayıt başarısız');
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-surface-card">
      <form onSubmit={handleRegister} className="p-8 bg-white shadow-card rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Kayıt Ol</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-secondary">Ad Soyad</label>
          <input type="text" name="full_name" onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-secondary">E-posta</label>
          <input type="email" name="email" onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-secondary">Şifre</label>
          <input type="password" name="password" onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-secondary">Rol</label>
          <select name="role" onChange={handleChange} className="w-full p-2 border rounded">
            <option value="student">Öğrenci</option>
            <option value="instructor">Eğitmen</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default Register;
