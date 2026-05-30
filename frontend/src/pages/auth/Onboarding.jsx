import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

const STUDENT_INTERESTS = [
  { label: "Siber Güvenlik", icon: "security" },
  { label: "Yapay Zeka ve ML", icon: "psychology" },
  { label: "Veri Bilimi", icon: "database" },
  { label: "Web Geliştirme", icon: "code" },
  { label: "Mobil Uygulama", icon: "smartphone" },
  { label: "Oyun Geliştirme", icon: "sports_esports" },
  { label: "Bulut Bilişim", icon: "cloud" },
  { label: "DevOps", icon: "terminal" },
];

const INSTRUCTOR_DOMAINS = [
  { label: "Yazılım", icon: "code" },
  { label: "Teknoloji", icon: "devices" },
  { label: "Müzik", icon: "music_note" },
  { label: "Matematik", icon: "functions" },
  { label: "Grafik Tasarım", icon: "palette" },
  { label: "Kişisel Gelişim", icon: "self_improvement" },
  { label: "İşletme", icon: "business" },
  { label: "Dil Eğitimi", icon: "translate" },
];

const Onboarding = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, setAuth, token } = useAuthStore();
  
  const isInstructor = user?.role === 'instructor';
  const displayList = isInstructor ? INSTRUCTOR_DOMAINS : STUDENT_INTERESTS;

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) return;
    setIsSubmitting(true);
    try {
      const interestsString = selectedInterests.join(', ');
      const response = await api.put('/auth/profile', { interests: interestsString });
      setAuth(response.data, token);
    } catch {
      // Endpoint henüz yoksa bile devam et
    } finally {
      setIsSubmitting(false);
      if (isInstructor) navigate('/instructor/dashboard');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-12">
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-indigo-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-xl shadow-primary/20">
            E
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            {isInstructor ? '🏫 Uzmanlık Alanın Nedir?' : '🚀 İlgi Alanlarını Seç!'}
          </h1>
          <p className="text-slate-400 text-base max-w-md mx-auto">
            {isInstructor
              ? "Yapay zeka buna göre seni doğru öğrencilerle buluşturacak."
              : "Sana özel bir yapay zeka yol haritası oluşturabilmemiz için ilgini çeken alanları seç."}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {displayList.map(item => {
            const isSelected = selectedInterests.includes(item.label);
            return (
              <button
                key={item.label}
                onClick={() => toggleInterest(item.label)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-2 group ${
                  isSelected
                    ? 'border-primary bg-primary/20 shadow-lg shadow-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isSelected ? 'bg-primary' : 'bg-white/10 group-hover:bg-white/20'
                }`}>
                  <span className="material-symbols-outlined text-[20px] text-white">{item.icon}</span>
                </div>
                <span className={`text-sm font-semibold leading-tight transition-colors ${
                  isSelected ? 'text-white' : 'text-slate-300'
                }`}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {selectedInterests.length > 0 && (
          <p className="text-center text-slate-400 text-sm mb-4">
            <span className="text-primary font-bold">{selectedInterests.length}</span> alan seçildi
          </p>
        )}

        <button
          onClick={handleContinue}
          disabled={isSubmitting || selectedInterests.length === 0}
          className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              Oluşturuluyor...
            </>
          ) : (
            <>
              {isInstructor ? 'Eğitmen Paneline Geç' : 'Dashboard\'a Git'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
