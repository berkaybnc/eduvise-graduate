import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [selectedRole, setSelectedRole] = useState(''); // 'student' or 'instructor'
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setSelectedRole('');
    setErrorMsg('');
    window.history.pushState(null, '', isLogin ? '/register' : '/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      if (isLogin) {
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        const token = response.data.access_token;
        
        const meResponse = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAuth(meResponse.data, token);

        if (meResponse.data.role === 'instructor') {
          navigate('/instructor/dashboard');
        } else if (!meResponse.data.interests && meResponse.data.role === 'student') {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        setIsLogin(true);
        setSelectedRole('');
        window.history.pushState(null, '', '/login');
        alert('Kayıt başarılı! Lütfen giriş yapın.');
      }
    } catch (error) {
      console.error('Auth Error:', error);
      setErrorMsg(isLogin ? 'E-posta veya şifre hatalı.' : 'Kayıt işlemi başarısız. E-posta zaten kullanımda olabilir.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-surface-low overflow-hidden">
      
      {/* Sol Panel - Premium Dekor (Glassmorphism & Gradient) */}
      <div className="relative hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-12 overflow-hidden shadow-2xl z-10">
        {/* Dekoratif Işıklar (Orbs) */}
        <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-[#6366F1]/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#14B8A6]/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/10">E</div>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">EduVise</span>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl font-black text-white leading-tight mb-6 tracking-tight">
              Geleceğini <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#3B82F6]">Yapay Zeka</span> ile <br/>
              Yeniden İnşa Et.
            </h1>
            <p className="text-lg text-indigo-100/80 max-w-md font-medium leading-relaxed">
              Sana özel hazırlanan adaptif yol haritaları ile zaman kaybetmeden hedeflerine ulaş. Kendi hızında, kendi tarzında öğren.
            </p>
          </div>
        </div>
        
        <div className="relative z-20 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-sm shadow-glass animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
              <span className="material-symbols-outlined text-emerald-400 text-3xl">auto_graph</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg">Kişiselleştirilmiş Rotan</p>
              <p className="text-indigo-200/80 text-sm">Hedefine en kısa yoldan ulaş.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Panel - Form (Interaktif UI) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-surface z-0 relative">
        {/* Mobile Background Orbs */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="w-full max-w-md z-10 animate-fade-in">
          {/* Logo (Mobil) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-tr from-primary to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">E</div>
            <span className="text-3xl font-black text-text-primary tracking-tight">EduVise</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-black text-text-primary tracking-tight mb-3">
              {isLogin ? 'Tekrar Hoş Geldin! 👋' : (!selectedRole ? 'Yolculuğun Başlıyor 🚀' : 'Bilgilerini Gir')}
            </h2>
            <p className="text-text-secondary text-base">
              {isLogin 
                ? 'Kaldığın yerden öğrenmeye devam et.' 
                : (!selectedRole ? 'Lütfen platformu hangi amaçla kullanacağını seç.' : 'Harika! Şimdi hesabını oluşturalım.')}
            </p>
          </div>

          {/* Hata Mesajı */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-error-container/50 border border-error/20 text-error rounded-xl flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-xl">error</span>
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}

          {/* REGISTER: Rol Seçimi Görsel Kartları */}
          {!isLogin && !selectedRole ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
              <button 
                type="button"
                onClick={() => setSelectedRole('student')}
                className="group relative p-6 bg-surface rounded-2xl border-2 border-border hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-2xl">school</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1">Öğrenciyim</h3>
                <p className="text-sm text-text-muted">Yeni yetenekler kazanmak ve gelişmek istiyorum.</p>
              </button>

              <button 
                type="button"
                onClick={() => setSelectedRole('instructor')}
                className="group relative p-6 bg-surface rounded-2xl border-2 border-border hover:border-[#14B8A6] hover:shadow-xl hover:shadow-[#14B8A6]/10 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#14B8A6]/5 rounded-bl-full -z-10 group-hover:bg-[#14B8A6]/10 transition-colors"></div>
                <div className="w-12 h-12 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#14B8A6] text-2xl">cast_for_education</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1">Eğitmenim</h3>
                <p className="text-sm text-text-muted">Bilgilerimi paylaşmak ve gelir elde etmek istiyorum.</p>
              </button>
            </div>
          ) : (
            /* FORM (Login veya Register - Rol seçilmişse) */
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
              {!isLogin && (
                <div className="mb-4">
                  <button 
                    type="button" 
                    onClick={() => setSelectedRole('')}
                    className="flex items-center gap-1 text-sm text-primary font-medium hover:underline mb-2"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Rol seçimine dön
                  </button>
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="material-symbols-outlined text-primary">
                      {selectedRole === 'student' ? 'school' : 'cast_for_education'}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {selectedRole === 'student' ? 'Öğrenci' : 'Eğitmen'} olarak kayıt oluyorsunuz.
                    </span>
                  </div>
                </div>
              )}

              {/* Full Name (Sadece Kayıt) */}
              {!isLogin && (
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">Ad Soyad</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-3.5 material-symbols-outlined text-text-muted group-focus-within:text-primary transition-colors">person</span>
                    <input 
                      type="text" 
                      name="full_name" 
                      value={formData.full_name} 
                      onChange={handleChange} 
                      className="w-full p-3.5 pl-12 bg-surface-low rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-surface outline-none transition-all font-medium text-text-primary placeholder:text-text-muted/60" 
                      placeholder="Ahmet Yılmaz" 
                      required 
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="animate-fade-in-up" style={{ animationDelay: isLogin ? '0.1s' : '0.2s' }}>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">E-posta Adresi</label>
                <div className="relative group">
                  <span className="absolute left-4 top-3.5 material-symbols-outlined text-text-muted group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full p-3.5 pl-12 bg-surface-low rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-surface outline-none transition-all font-medium text-text-primary placeholder:text-text-muted/60" 
                    placeholder="ornek@eduvise.com" 
                    required 
                  />
                </div>
              </div>
              
              {/* Password */}
              <div className="animate-fade-in-up" style={{ animationDelay: isLogin ? '0.2s' : '0.3s' }}>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-text-secondary">Şifre</label>
                  {isLogin && <a href="#" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">Şifremi Unuttum</a>}
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-3.5 material-symbols-outlined text-text-muted group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="w-full p-3.5 pl-12 bg-surface-low rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-surface outline-none transition-all font-medium text-text-primary placeholder:text-text-muted/60" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white font-bold text-lg py-4 rounded-xl hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 mt-6 animate-fade-in-up flex items-center justify-center gap-2"
                style={{ animationDelay: isLogin ? '0.3s' : '0.4s' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    İşleniyor...
                  </>
                ) : (isLogin ? 'Giriş Yap' : 'Hesabı Oluştur')}
              </button>
            </form>
          )}

          <div className="mt-10 text-center text-text-muted font-medium animate-fade-in">
            {isLogin ? 'Henüz hesabın yok mu? ' : 'Zaten bir hesabın var mı? '}
            <button 
              onClick={toggleMode} 
              type="button" 
              className="text-primary font-bold hover:text-primary-dark transition-colors focus:outline-none"
            >
              {isLogin ? 'Hemen Kayıt Ol' : 'Giriş Yap'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

