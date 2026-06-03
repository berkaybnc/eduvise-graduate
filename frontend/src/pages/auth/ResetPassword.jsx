import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [formData, setFormData] = useState({
    password: '',
    confirm_password: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !email) {
      setErrorMsg('Geçersiz veya eksik şifre sıfırlama parametreleri.');
      return;
    }
    
    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Şifreler uyuşmuyor.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      await api.post('/auth/reset-password', {
        email: email,
        token: token,
        password: formData.password,
      });
      
      setSuccessMsg('Şifreniz başarıyla sıfırlandı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset Password Error:', error);
      setErrorMsg(error.response?.data?.detail || 'Şifre sıfırlama işlemi başarısız. Linkin süresi dolmuş veya geçersiz olabilir.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-surface-low overflow-hidden">
      
      {/* Sol Panel - Premium Dekor */}
      <div className="relative hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-12 overflow-hidden shadow-2xl z-10">
        <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-[#6366F1]/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#14B8A6]/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/10">E</div>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">EduVise</span>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl font-black text-white leading-tight mb-6 tracking-tight">
              Güvenliğiniz <br/>
              Bizim İçin <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#3B82F6]">Öncelikli</span>.
            </h1>
            <p className="text-lg text-indigo-100/80 max-w-md font-medium leading-relaxed">
              Hesap şifrenizi yenileyerek güvenli bir şekilde öğrenmeye devam edin. Yeni ve güçlü bir şifre seçtiğinizden emin olun.
            </p>
          </div>
        </div>
        
        <div className="relative z-20 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-sm shadow-glass animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
              <span className="material-symbols-outlined text-emerald-400 text-3xl">lock_reset</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg">Şifre Sıfırlama</p>
              <p className="text-indigo-200/80 text-sm">Hesabınızı güvene alın.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-surface z-0 relative">
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
              Yeni Şifre Belirle 🔑
            </h2>
            <p className="text-text-secondary text-base">
              Lütfen hesabınız için yeni ve güçlü bir şifre girin.
            </p>
          </div>

          {/* Hata Mesajı */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-error-container/50 border border-error/20 text-error rounded-xl flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-xl">error</span>
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Başarı Mesajı */}
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-xl text-emerald-400">check_circle</span>
              <span className="text-sm font-medium">{successMsg}</span>
            </div>
          )}

          {(!token || !email) ? (
            <div className="p-6 bg-error-container/20 border border-error/20 text-error rounded-xl text-center">
              <span className="material-symbols-outlined text-5xl mb-3 text-error">warning</span>
              <p className="font-semibold text-lg mb-1">Geçersiz Parametreler</p>
              <p className="text-sm text-text-muted">Bu sayfaya doğrudan erişemezsiniz. E-postanıza gönderilen şifre sıfırlama linkine tıklamanız gerekmektedir.</p>
              <button 
                onClick={() => navigate('/login')}
                className="mt-6 text-primary font-bold hover:underline"
              >
                Giriş Ekranına Dön
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
              {/* Password */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Yeni Şifre</label>
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

              {/* Confirm Password */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Yeni Şifre Tekrar</label>
                <div className="relative group">
                  <span className="absolute left-4 top-3.5 material-symbols-outlined text-text-muted group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    type="password" 
                    name="confirm_password" 
                    value={formData.confirm_password} 
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
                style={{ animationDelay: '0.3s' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    Şifre Güncelleniyor...
                  </>
                ) : 'Şifreyi Güncelle'}
              </button>
            </form>
          )}

          <div className="mt-10 text-center text-text-muted font-medium animate-fade-in">
            <button 
              onClick={() => navigate('/login')} 
              type="button" 
              className="text-primary font-bold hover:text-primary-dark transition-colors focus:outline-none"
            >
              Giriş Yap Sayfasına Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
