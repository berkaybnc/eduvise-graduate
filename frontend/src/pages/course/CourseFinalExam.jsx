import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import useToastStore from '../../store/toastStore';

const CourseFinalExam = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const showToast = useToastStore(state => state.showToast);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [submittingResult, setSubmittingResult] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/assessments/${courseId}/final`);
        setQuestions(res.data || []);
      } catch (err) {
        console.error(err);
        showToast("Sorular yüklenirken hata oluştu.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [courseId]);

  const handleFinish = useCallback(async () => {
    if (finished) return;
    setFinished(true);
    setSubmittingResult(true);
    try {
      await api.post(`/assessments/${courseId}/final/submit`, { answers });
    } catch (err) {
      console.error(err);
      showToast("Sonuçlar gönderilemedi.", "error");
    } finally {
      setSubmittingResult(false);
    }
  }, [answers, courseId, finished]);

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const question = questions[currentIdx];
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0F172A] min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white font-bold text-xl">Bitirme Sınavı Hazırlanıyor...</h2>
          <p className="text-slate-400 text-sm">Yapay zeka soruları sizin için özel olarak derliyor.</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
     return (
        <div className="h-full flex items-center justify-center bg-[#0F172A] min-h-screen text-white">
           Sorular yüklenemedi. Lütfen daha sonra tekrar deneyin.
        </div>
     );
  }

  const question = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;
  const correctCount = answers.filter(a => a.selected === a.correct).length;
  const score = Math.round((correctCount / questions.length) * 100);

  if (finished) {
    const passed = score >= 80;
    const levelBg = passed ? 'from-emerald-900/50 to-[#0F172A]' : 'from-red-900/50 to-[#0F172A]';

    return (
      <div className="h-full min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative">
        <div className="max-w-lg w-full text-center z-10">
          <div className={`bg-gradient-to-br ${levelBg} border border-white/10 rounded-3xl p-10 mb-6 relative overflow-hidden`}>
            {submittingResult && (
              <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <h3 className="text-white font-bold text-lg mb-2">Sonuç Kaydediliyor...</h3>
              </div>
            )}
            
            <div className="text-6xl mb-4">{passed ? '🏆' : '📚'}</div>
            <h2 className="text-3xl font-black text-white mb-2">{passed ? 'Tebrikler, Sınavı Geçtiniz!' : 'Maalesef Sınavı Geçemediniz'}</h2>
            <p className="text-slate-400 mb-8">
                {passed 
                  ? 'Harika bir iş çıkardınız. Artık sertifikanızı alabilirsiniz.' 
                  : 'Sertifika alabilmek için bu sınavdan en az 80 puan almanız gerekmektedir.'}
            </p>
            <div className="w-32 h-32 rounded-full bg-[#0F172A] border-4 border-white/10 flex flex-col items-center justify-center mx-auto mb-6">
              <span className={`text-4xl font-black ${passed ? 'text-emerald-400' : 'text-red-400'}`}>{score}%</span>
              <span className="text-slate-500 text-xs">Puan</span>
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
            {passed ? (
                <button
                onClick={() => navigate(`/learn/${courseId}/complete`)}
                disabled={submittingResult}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                Sertifikayı Almaya Git
                </button>
            ) : (
                <button
                onClick={() => window.location.reload()}
                disabled={submittingResult}
                className="flex-1 bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                >
                Tekrar Dene
                </button>
            )}
            <button
              onClick={() => navigate(`/learn/${courseId}/complete`)}
              disabled={submittingResult}
              className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
            >
              Kursa Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen bg-[#0F172A] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#0F172A]/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/learn/${courseId}/complete`)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kursa Dön
          </button>
          <div className="h-5 w-px bg-white/10" />
          <div>
            <span className="text-white font-bold text-sm">Bitirme Sınavı</span>
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
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-sm font-medium">Soru {currentIdx + 1} / {questions.length}</span>
            </div>
            <h2 className="text-white text-xl font-bold leading-relaxed">{question.question}</h2>
          </div>

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

          <div className="flex items-center justify-between mt-auto pt-2">
            <div></div>
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

export default CourseFinalExam;
