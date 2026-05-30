import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

const STUDENT_INTERESTS = [
  "Siber Güvenlik",
  "Yapay Zeka ve Makine Öğrenmesi",
  "Veri Bilimi",
  "Web Geliştirme",
  "Mobil Uygulama Geliştirme",
  "Oyun Geliştirme",
  "Bulut Bilişim",
  "DevOps",
];

const INSTRUCTOR_DOMAINS = [
  "Yazılım",
  "Teknoloji",
  "Müzik",
  "Matematik",
  "Grafik Tasarım",
  "Kişisel Gelişim",
  "İşletme",
  "Dil Eğitimi"
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
    if (selectedInterests.length === 0) {
      alert("Lütfen en az bir ilgi alanı seçin!");
      return;
    }

    setIsSubmitting(true);
    try {
      const interestsString = selectedInterests.join(', ');
      // Kullanıcı profilini güncelle
      const response = await api.put('/auth/profile', { interests: interestsString });
      
      // Store'u güncelle
      setAuth(response.data, token);
      
      // Role göre yönlendir
      if (isInstructor) {
        navigate('/instructor/courses');
      } else {
        navigate('/assessment/diagnostic');
      }
    } catch {
      alert("Kaydedilirken bir hata oluştu.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-bright px-4">
      <div className="max-w-2xl w-full bg-surface border border-outline-variant rounded-xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2">Hoş Geldin, {user?.full_name?.split(' ')[0] || 'Kullanıcı'}!</h1>
          <p className="text-body-lg text-on-surface-variant">
            {isInstructor 
              ? "Eğitim vermek istediğiniz uzmanlık alanlarınızı seçin." 
              : "Sana özel bir yapay zeka yol haritası oluşturabilmemiz için ilgini çeken alanları seç."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {displayList.map(interest => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                selectedInterests.includes(interest)
                  ? 'border-primary bg-primary-container text-on-primary-container'
                  : 'border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              <span className="font-label-md">{interest}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={isSubmitting || selectedInterests.length === 0}
          className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Kaydediliyor...' : (isInstructor ? 'Panelime Git →' : 'Yol Haritamı Oluştur →')}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
