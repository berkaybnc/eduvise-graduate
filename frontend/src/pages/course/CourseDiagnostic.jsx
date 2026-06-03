import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import useToastStore from '../../store/toastStore';

const LEVELS = [
  { id: 'beginner', label: 'Başlangıç', desc: 'Bu konuya yeni başlıyorum', icon: 'emoji_nature', color: 'emerald' },
  { id: 'intermediate', label: 'Orta Seviye', desc: 'Temel bilgilerim var, geliştirmek istiyorum', icon: 'trending_up', color: 'primary' },
  { id: 'advanced', label: 'İleri Seviye', desc: 'Deneyimliyim, derinlemesine öğrenmek istiyorum', icon: 'military_tech', color: 'purple' },
];

const CourseDiagnostic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToastStore(state => state.showToast);

  const [step, setStep] = useState('level'); // 'level' | 'quiz' | 'analyzing' | 'roadmap'
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]); // [{ questionId, selected, isCorrect }]
  const [selectedOpt, setSelectedOpt] = useState(null);

  const { data: course, isLoading: loadingCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`);
      return res.data;
    }
  });

  const { data: aiData, isLoading: loadingQuestions } = useQuery({
    queryKey: ['diagnostic-questions', id],
    queryFn: async () => {
      const res = await api.get(`/ai/diagnostic-questions/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  const questionList = aiData?.questions || [];
  const prerequisiteRoadmap = aiData?.prerequisite_roadmap || '';

  const handleLevelContinue = () => {
    if (!selectedLevel) return;
    setStep('quiz');
  };

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      const firstVideoId = course?.sections?.[0]?.videos?.[0]?.id || 'start';
      navigate(`/learn/${id}/${firstVideoId}`);
    } catch {
      showToast("Kayıt olurken bir hata oluştu.", "error");
      navigate(`/courses/${id}`);
    }
  };

  const handleAnswer = () => {
    if (selectedOpt === null) return;
    const isCorrect = selectedOpt === questionList[currentQ].correct;
    
    const newAnswers = [...answers, { questionId: questionList[currentQ].id, selected: selectedOpt, isCorrect }];
    setAnswers(newAnswers);

    if (currentQ < questionList.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOpt(null);
    } else {
      setStep('analyzing');
      
      setTimeout(() => {
        // Evaluate score
        const correctCount = newAnswers.filter(a => a.isCorrect).length;
        // If passed (e.g. >= 2 out of 3)
        if (correctCount >= 2) {
          handleEnroll();
        } else {
          setStep('roadmap');
        }
      }, 2500);
    }
  };

  if (loadingCourse) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
         <span className="material-symbols-outlined animate-spin text-primary text-4xl mb-4">progress_activity</span>
         <h2 className="text-xl font-bold text-white">Kurs Bilgileri Yükleniyor...</h2>
      </div>
    );
  }

  if (!course) {
    return <div className="p-8 text-center text-error font-bold">Kurs bulunamadı!</div>;
  }

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
          <h2 className="text-2xl font-black text-white mb-3">Önkoşul Bilginiz Analiz Ediliyor...</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Yapay zeka cevaplarınızı değerlendiriyor ve bu kursa hazır olup olmadığınızı belirliyor. Bu sadece birkaç saniye sürecek.
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

  // —— Roadmap (Başarısız Test) Ekranı ——
  if (step === 'roadmap') {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="bg-[#1E293B] border border-orange-500/30 rounded-2xl p-8 max-w-2xl w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-orange-500 text-3xl">route</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Önkoşul Yol Haritası</h2>
              <p className="text-orange-400 text-sm">Bu eğitime henüz hazır görünmüyorsunuz.</p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-white/5 mb-8">
            <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
              {prerequisiteRoadmap}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(`/courses/${id}`)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-bold transition-all"
            >
              Kursa Geri Dön
            </button>
            <button
              onClick={handleEnroll}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Yine de Kaydol
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questionList.length > 0 ? questionList[currentQ] : null;

  return (
    <div className="h-full overflow-y-auto p-6 flex items-start justify-center">
      <div className="w-full max-w-2xl pt-4 pb-10">

        {/* Course Header Card */}
        <div className={`relative bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 mb-6 overflow-hidden border border-white/10`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/60 text-xs font-medium bg-white/10 border border-white/10 px-2 py-1 rounded-md">{course.category}</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-1">{course.title}</h1>
            <div className="flex items-center gap-2 text-primary/80 text-sm mt-2">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span className="font-semibold">Kursa başlamadan önce temel bilgilerinizi (önkoşullar) ölçüyoruz</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {['Seviye Seç', 'Önkoşul Testi', 'Sonuç'].map((label, i) => {
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
              <p className="text-slate-400 text-sm">Bu seçim, yapay zekanın önkoşul sınavınızı nasıl değerlendireceğini etkiler.</p>
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
              Önkoşul Testine Devam Et
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* —— STEP 2: Quiz —— */}
        {step === 'quiz' && (
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 min-h-[400px] flex flex-col">
            {loadingQuestions ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl mb-4">psychology</span>
                <h3 className="text-white font-bold text-lg mb-2">Önkoşul Soruları Hazırlanıyor...</h3>
                <p className="text-slate-400 text-sm text-center max-w-sm">
                  {course.title} kursuna başlamadan önce bilmeniz gereken temel kavramlar analiz ediliyor.
                </p>
                <div className="mt-6 flex justify-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            ) : !question ? (
               <div className="flex-1 flex flex-col items-center justify-center text-error">
                  <span className="material-symbols-outlined text-4xl mb-2">error</span>
                  <p>Sorular yüklenemedi. Lütfen tekrar deneyin.</p>
               </div>
            ) : (
              <>
                {/* Quiz Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-slate-500 text-xs font-medium mb-1">Önkoşul Seviye Testi</p>
                    <h2 className="text-white font-black text-lg">Soru {currentQ + 1} / {questionList.length}</h2>
                  </div>
                  <div className="flex gap-1.5">
                    {questionList.map((_, i) => (
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
                  className="w-full mt-auto bg-gradient-to-r from-primary to-indigo-600 text-white py-3.5 rounded-xl font-black hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {currentQ < questionList.length - 1 ? 'Sonraki Soru' : 'Analizi Başlat'}
                  <span className="material-symbols-outlined text-[18px]">
                    {currentQ < questionList.length - 1 ? 'arrow_forward' : 'psychology'}
                  </span>
                </button>

                {/* AI Note */}
                <div className="mt-4 flex items-start gap-2 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">lightbulb</span>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Bu önkoşul sınavı, doğrudan kursa başlamaya hazır olup olmadığınızı belirler.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseDiagnostic;
