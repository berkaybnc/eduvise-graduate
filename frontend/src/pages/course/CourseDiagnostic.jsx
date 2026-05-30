import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const COURSE_INFO = {
  1: { title: 'İleri Seviye Yapay Zeka', category: 'Yapay Zeka', gradient: 'from-blue-600 to-indigo-900' },
  2: { title: 'Siber Güvenliğe Giriş', category: 'Siber Güvenlik', gradient: 'from-emerald-500 to-teal-800' },
  3: { title: 'Modern React ve Next.js', category: 'Yazılım', gradient: 'from-orange-500 to-red-800' },
  4: { title: 'Veri Bilimi Masterclass', category: 'Veri Bilimi', gradient: 'from-purple-500 to-fuchsia-800' },
};

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    question: 'Aşağıdakilerden hangisi bir programlama döngüsü türüdür?',
    options: ['If-Else', 'For', 'Class', 'String'],
    correct: 1,
  },
  {
    id: 2,
    question: 'Hangi veri yapısı LIFO (Son Giren İlk Çıkar) prensibine göre çalışır?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correct: 1,
  },
  {
    id: 3,
    question: 'Bir fonksiyonun kendini çağırmasına ne ad verilir?',
    options: ['Döngü', 'Recursion (Özyineleme)', 'Callback', 'Promise'],
    correct: 1,
  },
];

const LEVELS = [
  { id: 'beginner', label: 'Başlangıç', desc: 'Bu konuya yeni başlıyorum', icon: 'emoji_nature', color: 'emerald' },
  { id: 'intermediate', label: 'Orta Seviye', desc: 'Temel bilgilerim var, geliştirmek istiyorum', icon: 'trending_up', color: 'primary' },
  { id: 'advanced', label: 'İleri Seviye', desc: 'Deneyimliyim, derinlemesine öğrenmek istiyorum', icon: 'military_tech', color: 'purple' },
];

const CourseDiagnostic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = COURSE_INFO[id] || { title: 'Eğitim', category: 'Genel', gradient: 'from-slate-700 to-slate-900' };

  const [step, setStep] = useState('level'); // 'level' | 'quiz' | 'analyzing'
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);

  const question = DIAGNOSTIC_QUESTIONS[currentQ];

  const handleLevelContinue = () => {
    if (!selectedLevel) return;
    setStep('quiz');
  };

  const handleAnswer = () => {
    if (selectedOpt === null) return;
    const newAnswers = [...answers, selectedOpt];
    setAnswers(newAnswers);

    if (currentQ < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOpt(null);
    } else {
      setStep('analyzing');
      setTimeout(() => navigate(`/courses/${id}`), 2500);
    }
  };

  // —— Analiz Ekranı ——
  if (step === 'analyzing') {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-primary text-2xl">psychology</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Seviyeniz Analiz Ediliyor...</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Yapay zeka cevaplarınızı değerlendiriyor ve size özel bir öğrenme yol haritası oluşturuyor. Bu sadece birkaç saniye sürecek.
          </p>
          <div className="mt-6 flex justify-center gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 flex items-start justify-center">
      <div className="w-full max-w-2xl pt-4 pb-10">

        {/* Course Header Card */}
        <div className={`relative bg-gradient-to-br ${course.gradient} rounded-2xl p-6 mb-6 overflow-hidden`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/60 text-xs font-medium bg-white/10 px-2 py-1 rounded-md">{course.category}</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-1">{course.title}</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>Kursa başlamadan önce seviyenizi ölçüyoruz</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {['Seviye Seç', 'Hızlı Test', 'Sonuç'].map((label, i) => {
            const stepIdx = step === 'level' ? 0 : step === 'quiz' ? 1 : 2;
            const isDone = i < stepIdx;
            const isActive = i === stepIdx;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isDone ? 'bg-emerald-500 text-white' :
                  isActive ? 'bg-primary text-white' :
                  'bg-white/10 text-slate-500'
                }`}>
                  {isDone ? <span className="material-symbols-outlined text-[14px]">check</span> : i + 1}
                </div>
                <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-500'}`}>{label}</span>
                {i < 2 && <div className={`flex-1 h-px ${i < stepIdx ? 'bg-emerald-500/50' : 'bg-white/10'}`} />}
              </div>
            );
          })}
        </div>

        {/* —— STEP 1: Level Selection —— */}
        {step === 'level' && (
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-white text-xl font-black mb-1">Bu alanda kendinizi nasıl tanımlarsınız?</h2>
              <p className="text-slate-400 text-sm">Yapay zeka, cevabınıza göre öğrenme hızınızı ve içerik derinliğini ayarlayacak.</p>
            </div>

            <div className="space-y-3 mb-6">
              {LEVELS.map(level => {
                const isSelected = selectedLevel === level.id;
                const colors = {
                  emerald: isSelected ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-emerald-500/40',
                  primary: isSelected ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-primary/40',
                  purple: isSelected ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-purple-500/40',
                };
                const iconColors = {
                  emerald: isSelected ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-400 bg-white/5',
                  primary: isSelected ? 'text-primary bg-primary/20' : 'text-slate-400 bg-white/5',
                  purple: isSelected ? 'text-purple-400 bg-purple-500/20' : 'text-slate-400 bg-white/5',
                };
                return (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group ${colors[level.color]}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${iconColors[level.color]}`}>
                      <span className="material-symbols-outlined text-2xl">{level.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-base ${isSelected ? 'text-white' : 'text-slate-200'}`}>{level.label}</p>
                      <p className="text-slate-400 text-sm mt-0.5">{level.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'border-current bg-current' : 'border-slate-600'
                    }`}>
                      {isSelected && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleLevelContinue}
              disabled={!selectedLevel}
              className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3.5 rounded-xl font-black hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Hızlı Teste Devam Et
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* —— STEP 2: Quiz —— */}
        {step === 'quiz' && (
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Hızlı Seviye Testi</p>
                <h2 className="text-white font-black text-lg">Soru {currentQ + 1} / {DIAGNOSTIC_QUESTIONS.length}</h2>
              </div>
              <div className="flex gap-1.5">
                {DIAGNOSTIC_QUESTIONS.map((_, i) => (
                  <div key={i} className={`w-8 h-2 rounded-full transition-all ${
                    i < currentQ ? 'bg-emerald-500' :
                    i === currentQ ? 'bg-primary' :
                    'bg-white/10'
                  }`} />
                ))}
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <p className="text-white text-lg font-bold leading-relaxed">{question.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOpt(i)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedOpt === i
                      ? 'border-primary bg-primary/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-primary/40 hover:bg-primary/5 hover:text-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 text-sm font-black transition-all ${
                    selectedOpt === i ? 'border-primary bg-primary text-white' : 'border-white/20 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-medium">{opt}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleAnswer}
              disabled={selectedOpt === null}
              className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3.5 rounded-xl font-black hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {currentQ < DIAGNOSTIC_QUESTIONS.length - 1 ? 'Sonraki Soru' : 'Analizi Başlat'}
              <span className="material-symbols-outlined text-[18px]">
                {currentQ < DIAGNOSTIC_QUESTIONS.length - 1 ? 'arrow_forward' : 'psychology'}
              </span>
            </button>

            {/* AI Note */}
            <div className="mt-4 flex items-start gap-2 p-3 bg-primary/5 border border-primary/10 rounded-xl">
              <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">lightbulb</span>
              <p className="text-slate-400 text-xs leading-relaxed">
                Bu test sadece seviyenizi belirlemek için kullanılıyor. Yanlış cevap vermeniz ceza değil, daha doğru bir yol haritası oluşturulmasını sağlar.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseDiagnostic;
