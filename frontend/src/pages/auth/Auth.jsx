import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // URL'yi değiştirerek kullanıcıya doğru hissi verebiliriz (opsiyonel)
    window.history.pushState(null, '', isLogin ? '/register' : '/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        // Login Akışı
        const response = await api.post('/auth/login', { email: formData.email, password: formData.password });
        const token = response.data.access_token;
        
        const meResponse = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAuth(meResponse.data, token);

        if (!meResponse.data.interests && meResponse.data.role === 'student') {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Register Akışı
        await api.post('/auth/register', formData);
        alert('Kayıt başarılı! Lütfen giriş yapın.');
        setIsLogin(true); // Giriş ekranına geç
        window.history.pushState(null, '', '/login');
      }
    } catch {
      alert(isLogin ? 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.' : 'Kayıt başarısız. E-posta kullanımda olabilir.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-surface-bright overflow-hidden">
      {/* Sol Panel - Renkli & Estetik Dekor */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary via-[#6C3CE9] to-secondary p-12 overflow-hidden">
        {/* Cam Efekti Çemberler */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary-container/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xl shadow-lg">E</div>
            <span className="text-2xl font-bold text-white tracking-wide">EduVise</span>
          </div>
          
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Öğrenme Yolculuğunu <br/> 
            <span className="text-secondary-fixed">Yapay Zeka</span> ile Şekillendir.
          </h1>
          <p className="text-lg text-primary-fixed-dim max-w-md">
            Size özel oluşturulan yol haritası ile hedeflerinize en hızlı ve verimli şekilde ulaşın. Hemen aramıza katılın.
          </p>
        </div>
        
        <div className="relative z-10 glass-panel bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white">school</span>
            </div>
            <div>
              <p className="text-white font-bold">10,000+ Öğrenci</p>
              <p className="text-white/70 text-sm">Hedefine başarıyla ulaştı.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Panel - Form (Login & Register Birlikte) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-surface">
        <div className="w-full max-w-md">
          {/* Logo (Sadece Mobilde) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">E</div>
            <span className="text-2xl font-bold text-on-surface tracking-wide">EduVise</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-headline-lg font-bold text-on-surface mb-2">
              {isLogin ? 'Tekrar Hoş Geldiniz' : 'Aramıza Katılın'}
            </h2>
            <p className="text-on-surface-variant text-body-md">
              {isLogin 
                ? 'Kaldığınız yerden devam etmek için giriş yapın.' 
                : 'Yapay zeka destekli eğitiminize başlamak için hesap oluşturun.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Register'a Özel Alanlar */}
            <div className={`space-y-5 transition-all duration-500 overflow-hidden ${isLogin ? 'max-h-0 opacity-0' : 'max-h-64 opacity-100'}`}>
              <div>
                <label className="block text-sm font-label-md text-on-surface mb-1">Ad Soyad</label>
                <input 
                  type="text" 
                  name="full_name" 
                  value={formData.full_name} 
                  onChange={handleChange} 
                  className="w-full p-3 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                  placeholder="Ahmet Yılmaz" 
                  required={!isLogin} 
                />
              </div>
              <div>
                <label className="block text-sm font-label-md text-on-surface mb-1">Kullanıcı Rolü</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange} 
                  className="w-full p-3 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                >
                  <option value="student">Öğrenci</option>
                  <option value="instructor">Eğitmen</option>
                </select>
              </div>
            </div>

            {/* Ortak Alanlar (Email, Password) */}
            <div>
              <label className="block text-sm font-label-md text-on-surface mb-1">E-posta Adresi</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 material-symbols-outlined text-outline">mail</span>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full p-3 pl-10 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                  placeholder="ornek@eduvise.com" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-label-md text-on-surface">Şifre</label>
                {isLogin && <a href="#" className="text-sm font-label-md text-primary hover:underline">Şifremi Unuttum</a>}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3.5 material-symbols-outlined text-outline">lock</span>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  className="w-full p-3 pl-10 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-label-lg font-bold py-3.5 rounded-xl hover:bg-primary-dark transition-all hover:shadow-lg disabled:opacity-70 mt-4"
            >
              {isSubmitting 
                ? 'İşleniyor...' 
                : (isLogin ? 'Giriş Yap' : 'Hesap Oluştur')}
            </button>
          </form>

          <div className="mt-8 text-center text-on-surface-variant font-body-md">
            {isLogin ? 'Hesabınız yok mu? ' : 'Zaten hesabınız var mı? '}
            <button 
              onClick={toggleMode} 
              type="button" 
              className="text-primary font-label-md font-bold hover:underline transition-colors focus:outline-none"
            >
              {isLogin ? 'Hemen Kayıt Olun' : 'Giriş Yapın'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
