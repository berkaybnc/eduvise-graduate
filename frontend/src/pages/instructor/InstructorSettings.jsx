import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import FileUploadZone from '../../components/FileUploadZone';

const InstructorSettings = () => {
  const { user, token, setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    interests: '',
    avatar_url: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || prev.full_name || '',
        bio: user.bio || prev.bio || '',
        interests: user.interests || prev.interests || '',
        avatar_url: user.avatar_url || prev.avatar_url || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/auth/profile', formData);
      setAuth(res.data, token); // Update store with new data
      setMessage({ type: 'success', text: 'Profiliniz başarıyla güncellendi.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.detail || 'Profil güncellenirken bir hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        
        {/* Header */}
        <div>
          <h1 className="text-white text-2xl font-black tracking-tight">Profil Ayarları</h1>
          <p className="text-slate-400 text-sm mt-1">Öğrencilerin göreceği genel eğitmen profilinizi buradan yönetebilirsiniz.</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <span className="material-symbols-outlined">
              {message.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <p className="font-semibold text-sm">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#1E293B] p-6 rounded-2xl border border-white/10">
          
          {/* Avatar Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-white/5 pb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shrink-0 overflow-hidden border-2 border-white/10">
              {formData.avatar_url ? (
                <img src={formData.avatar_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${formData.avatar_url}` : formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{formData.full_name ? formData.full_name[0] : 'U'}</span>
              )}
            </div>
            <div className="flex-1 w-full">
              <label className="block text-slate-300 text-sm font-semibold mb-2">Profil Fotoğrafı</label>
              <FileUploadZone
                accept="image/*"
                label="Fotoğraf yükleyin veya sürükleyin"
                icon="add_a_photo"
                hint="JPG, PNG (Maks 5MB)"
                onUploaded={(url) => setFormData(p => ({ ...p, avatar_url: url }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-white/5 pb-6">
            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">Ad Soyad</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="Örn: Dr. Ahmet Yılmaz"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">Hakkında (Biyografi)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all min-h-[120px]"
                placeholder="Öğrencilerinize kendinizi, deneyimlerinizi ve uzmanlık alanlarınızı tanıtın..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">Uzmanlık Alanları (Virgülle ayırın)</label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData(p => ({ ...p, interests: e.target.value }))}
                className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="Örn: Python, Makine Öğrenmesi, Veri Bilimi"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Kaydediliyor...</>
              ) : (
                'Değişiklikleri Kaydet'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default InstructorSettings;
