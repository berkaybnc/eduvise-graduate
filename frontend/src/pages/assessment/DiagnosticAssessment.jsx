import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useToastStore from '../../store/toastStore';

const DIFFICULTY_COLORS = {
  'Kolay': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Orta': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Zor': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const FIELDS = [
  { id: 'frontend', name: 'Frontend Geliştirme', icon: 'web', desc: 'React, Vue, HTML, CSS ve modern arayüz teknolojileri.' },
  { id: 'backend', name: 'Backend Geliştirme', icon: 'dns', desc: 'Sunucu mimarisi, API tasarımı, veritabanı yönetimi.' },
  { id: 'siber', name: 'Siber Güvenlik', icon: 'security', desc: 'Ağ güvenliği, sızma testleri ve kriptografi.' },
  { id: 'veri', name: 'Veri Bilimi & AI', icon: 'analytics', desc: 'Makine öğrenmesi, veri analizi ve istatistik.' },
  { id: 'mobil', name: 'Mobil Geliştirme', icon: 'smartphone', desc: 'iOS, Android ve Cross-Platform uygulama geliştirme.' }
];

const DiagnosticAssessment = () => {
  const navigate = useNavigate();
  const showToast = useToastStore(state => state.showToast);
  const [selectedField, setSelectedField] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [finished, setFinished] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  const startAssessment = async (field) => {
    setSelectedField(field);
    setLoading(true);
    try {
      const res = await api.get(`/assessments/diagnostic/field/${field.name}`);
      setQuestions(res.data.questions || []);
      setTimeLeft(30 * 60);
    } catch (err) {
      console.error(err);
      showToast("Sorular yüklenirken hata oluştu.", "error");
      setSelectedField(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = useCallback(async () => {
    if (finished) return;
    setFinished(true);
    setGeneratingRoadmap(true);
    try {
      await api.post('/assessments/diagnostic/submit', {
        field_name: selectedField.name,
        answers: answers
      });
    } catch (err) {
      console.error(err);
      showToast("Sonuçlar gönderilemedi.", "error");
    } finally {
      setGeneratingRoadmap(false);
    }
  }, [answers, selectedField, finished]);

  useEffect(() => {
    if (finished || !selectedField || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleFinish(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, selectedField, questions, handleFinish]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const question = questions[currentIdx];
    // Update answers correctly by checking if it already exists
    setAnswers(prev => {
        const newAns = [...prev];
        const existingIdx = newAns.findIndex(a => a.questionId === question.id);
        const ansObj = { questionId: question.id, selected, correct: question.correct };
        if (existingIdx >= 0) newAns[existingIdx] = ansObj;
        else newAns.push(ansObj);
        return newAns;
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      handleFinish();
    }
  };

  // 1. EKRAN: Alan Seçimi
  if (!selectedField) {
    return (
      <div className="h-full flex flex-col p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-4">Kariyer Hedefinizi Belirleyin</h1>
            <p className="text-slate-400 text-lg">Yapay zekanın size özel bir öğrenme yolu çıkarabilmesi için ilerlemek istediğiniz alanı seçin. Ardından seviyenizi ölçecek detaylı bir değerlendirme sınavına gireceksiniz.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FIELDS.map(field => (
              <div 
                key={field.id}
                onClick={() => startAssessment(field)}
                className="bg-[#1E293B] border border-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 cursor-pointer group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">{field.icon}</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">{field.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{field.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Yükleniyor Ekranı
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white font-bold text-xl">Sınav Hazırlanıyor...</h2>
          <p className="text-slate-400 text-sm">{selectedField.name} alanına özel sorular getiriliyor.</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const question = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;
  const correctCount = answers.filter(a => a.selected === a.correct).length;
  const score = Math.round((correctCount / questions.length) * 100);

  // Tamamlanma Ekranı
  if (finished) {
    const level = score >= 80 ? 'İleri Seviye' : score >= 50 ? 'Orta Seviye' : 'Başlangıç';
    const levelColor = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
    const levelBg = score >= 80 ? 'from-emerald-900/50 to-[#0F172A]' : score >= 50 ? 'from-yellow-900/50 to-[#0F172A]' : 'from-red-900/50 to-[#0F172A]';

    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className={`bg-gradient-to-br ${levelBg} border border-white/10 rounded-3xl p-10 mb-6 relative overflow-hidden`}>
            {generatingRoadmap && (
              <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <h3 className="text-white font-bold text-lg mb-2">Yol Haritası Oluşturuluyor...</h3>
                <p className="text-slate-400 text-sm">Cevaplarınız analiz ediliyor.</p>
              </div>
            )}
            
            <div className="text-6xl mb-4">{score >= 80 ? '🏆' : score >= 50 ? '📈' : '📚'}</div>
            <h2 className="text-3xl font-black text-white mb-2">Değerlendirme Tamamlandı!</h2>
            <p className="text-slate-400 mb-8">{selectedField.name} alanındaki seviyeniz belirlendi.</p>
            <div className="w-32 h-32 rounded-full bg-[#0F172A] border-4 border-white/10 flex flex-col items-center justify-center mx-auto mb-6">
              <span className={`text-4xl font-black ${levelColor}`}>{score}%</span>
              <span className="text-slate-500 text-xs">Başarı</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${levelColor} ${levelColor.replace('text-', 'bg-').replace('400', '500/10')} border-current/20`}>
              <span className="material-symbols-outlined text-[16px]">military_tech</span>
              {level}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-white text-2xl font-black">{correctCount}</p>
              <p className="text-slate-400 text-xs">Doğru</p>
            </div>
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-red-400 text-2xl font-black">{questions.length - correctCount}</p>
              <p className="text-slate-400 text-xs">Yanlış</p>
            </div>
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-white text-2xl font-black">{questions.length}</p>
              <p className="text-slate-400 text-xs">Toplam</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/roadmap')}
              disabled={generatingRoadmap}
              className="flex-1 bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              Yol Haritama Git
            </button>
            <button
              onClick={() => window.location.reload()}
              disabled={generatingRoadmap}
              className="px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
            >
              Tekrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="px-6 py-3 border-b border-white/5 bg-[#0F172A]/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Alan Seçimi
          </button>
          <div className="h-5 w-px bg-white/10" />
          <div>
            <span className="text-white font-bold text-sm">Seviye Tespit Sınavı</span>
            <span className="text-slate-500 text-xs ml-2">· {selectedField.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-primary text-[16px] animate-pulse">psychology</span>
            <span className="text-primary text-xs font-bold">AI Analiz Ediyor</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${timeLeft < 60 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-white'}`}>
            <span className="material-symbols-outlined text-[16px]">timer</span>
            <span className="font-mono text-sm font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/5 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row gap-6 p-6">
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
          {/* Question Header */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm font-medium">Soru {currentIdx + 1} / {questions.length}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${DIFFICULTY_COLORS[question.difficulty || 'Orta'] || DIFFICULTY_COLORS['Orta']}`}>
                  {question.difficulty || 'Orta'}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                {question.category || 'Genel'}
              </span>
            </div>
            <h2 className="text-white text-xl font-bold leading-relaxed">{question.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-4">
            {question.options.map((opt, i) => {
              let style = 'bg-[#1E293B] border-white/10 text-slate-300 hover:border-primary/40 hover:bg-primary/5 hover:text-white';
              if (selected === i && !submitted) style = 'bg-primary/20 border-primary text-white';
              if (submitted) {
                if (i === question.correct) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                else if (i === selected && selected !== question.correct) style = 'bg-red-500/20 border-red-500 text-red-300';
                else style = 'bg-white/5 border-white/5 text-slate-500 opacity-60';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={submitted}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${style} ${!submitted ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-sm ${
                    submitted && i === question.correct ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' :
                    submitted && i === selected && selected !== question.correct ? 'border-red-500 bg-red-500/20 text-red-400' :
                    selected === i && !submitted ? 'border-primary bg-primary text-white' :
                    'border-white/20 text-slate-500'
                  }`}>
                    {submitted && i === question.correct
                      ? <span className="material-symbols-outlined text-[16px]">check</span>
                      : submitted && i === selected && selected !== question.correct
                      ? <span className="material-symbols-outlined text-[16px]">close</span>
                      : String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <button
              onClick={handleNext}
              className="text-slate-500 hover:text-slate-300 text-sm font-semibold transition-colors"
            >
              Atla →
            </button>
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="bg-gradient-to-r from-primary to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Cevabı Gönder
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
              >
                {currentIdx < questions.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Mini İlerleme */}
        <aside className="w-full lg:w-48 shrink-0">
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 sticky top-0">
                <h3 className="text-white font-bold text-sm mb-4">Sınav</h3>
                <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, i) => {
                        const ans = answers.find(a => a.questionId === q.id);
                        return (
                        <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            i === currentIdx ? 'bg-primary text-white ring-2 ring-primary/30' :
                            ans ? (ans.selected === ans.correct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400') :
                            'bg-white/5 text-slate-500'
                        }`}>
                            {ans ? (ans.selected === ans.correct ? '✓' : '✗') : i + 1}
                        </div>
                        );
                    })}
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
};

export default DiagnosticAssessment;
