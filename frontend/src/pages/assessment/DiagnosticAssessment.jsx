import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const QUESTIONS = [
  {
    id: 1,
    category: 'Veri Yapıları',
    difficulty: 'Orta',
    question: 'Bir Binary Search Tree\'de en kötü durumda arama işleminin zaman karmaşıklığı nedir?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correct: 2,
    explanation: 'Dengeli olmayan bir BST\'de tüm düğümler tek yönde zincirlenebilir ve bu O(n) karmaşıklığına yol açar.',
    tip: 'BST\'de denge çok önemlidir. Dengeli ağaçlar (AVL, Red-Black) O(log n) garanti eder.',
  },
  {
    id: 2,
    category: 'Algoritmalar',
    difficulty: 'Kolay',
    question: 'Bubble Sort algoritmasının en kötü durum zaman karmaşıklığı nedir?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correct: 2,
    explanation: 'Bubble Sort\'ta her eleman diğer tüm elemanlarla karşılaştırılabilir, bu O(n²) zaman alır.',
    tip: 'Bubble Sort eğitim amaçlı kullanışlıdır ama büyük veri setleri için uygun değildir.',
  },
  {
    id: 3,
    category: 'Graf Teorisi',
    difficulty: 'Zor',
    question: 'Dijkstra algoritması hangi tür graflarda doğru çalışmaz?',
    options: [
      'Ağırlıklı yönlü graflarda',
      'Negatif ağırlıklı kenarlı graflarda',
      'Yönsüz graflarda',
      'Büyük graflarda',
    ],
    correct: 1,
    explanation: 'Dijkstra, negatif ağırlıklı kenarlarda yanlış sonuç verir çünkü ziyaret edilen düğümleri yeniden işlemez.',
    tip: 'Negatif ağırlıklı graflarda Bellman-Ford algoritması kullanılmalıdır.',
  },
  {
    id: 4,
    category: 'Bellek Yönetimi',
    difficulty: 'Orta',
    question: 'Stack ve Heap bellek bölgeleri arasındaki temel fark nedir?',
    options: [
      'Stack daha büyüktür',
      'Heap statik, Stack dinamik bellek kullanır',
      'Stack otomatik yönetilir, Heap manuel/GC yönetimlidir',
      'İkisi de aynı şekilde çalışır',
    ],
    correct: 2,
    explanation: 'Stack, fonksiyon çağrıları ve yerel değişkenler için otomatik yönetilir. Heap ise dinamik bellek için kullanılır ve garbage collector veya manuel olarak yönetilir.',
    tip: 'Stack overflow, çok derin recursive çağrılardan kaynaklanır.',
  },
  {
    id: 5,
    category: 'Olasılık',
    difficulty: 'Kolay',
    question: 'İki bağımsız olayın birlikte gerçekleşme olasılığı nasıl hesaplanır?',
    options: [
      'P(A) + P(B)',
      'P(A) × P(B)',
      'P(A) - P(B)',
      'P(A) / P(B)',
    ],
    correct: 1,
    explanation: 'Bağımsız olaylar için P(A ∩ B) = P(A) × P(B) kuralı uygulanır.',
    tip: 'Bağımlı olaylarda koşullu olasılık P(A|B) kullanılır.',
  },
];

const DIFFICULTY_COLORS = {
  'Kolay': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Orta': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Zor': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const DiagnosticAssessment = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[currentIdx];
  const progress = ((currentIdx) / QUESTIONS.length) * 100;

  const handleFinish = useCallback(() => {
    setFinished(true);
  }, []);

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleFinish(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, handleFinish]);

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
    setAnswers(prev => [...prev, { questionId: question.id, selected, correct: question.correct }]);
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      handleFinish();
    }
  };

  const correctCount = answers.filter(a => a.selected === a.correct).length;
  const score = Math.round((correctCount / QUESTIONS.length) * 100);

  // Tamamlanma Ekranı
  if (finished) {
    const level = score >= 80 ? 'İleri Seviye' : score >= 50 ? 'Orta Seviye' : 'Başlangıç';
    const levelColor = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
    const levelBg = score >= 80 ? 'from-emerald-900/50 to-[#0F172A]' : score >= 50 ? 'from-yellow-900/50 to-[#0F172A]' : 'from-red-900/50 to-[#0F172A]';

    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className={`bg-gradient-to-br ${levelBg} border border-white/10 rounded-3xl p-10 mb-6`}>
            <div className="text-6xl mb-4">{score >= 80 ? '🏆' : score >= 50 ? '📈' : '📚'}</div>
            <h2 className="text-3xl font-black text-white mb-2">Değerlendirme Tamamlandı!</h2>
            <p className="text-slate-400 mb-8">Yapay zeka sonuçlarını analiz ediyor ve yol haritanı güncelleniyor...</p>
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
              <p className="text-red-400 text-2xl font-black">{QUESTIONS.length - correctCount}</p>
              <p className="text-slate-400 text-xs">Yanlış</p>
            </div>
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-white text-2xl font-black">{QUESTIONS.length}</p>
              <p className="text-slate-400 text-xs">Toplam</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/roadmap')}
              className="flex-1 bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              Yol Haritama Git
            </button>
            <button
              onClick={() => { setCurrentIdx(0); setSelected(null); setSubmitted(false); setAnswers([]); setFinished(false); setTimeLeft(20 * 60); }}
              className="px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
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
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            Çıkış
          </button>
          <div className="h-5 w-px bg-white/10" />
          <div>
            <span className="text-white font-bold text-sm">Seviye Tespit Sınavı</span>
            <span className="text-slate-500 text-xs ml-2">· {question.category}</span>
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

        {/* Question Card */}
        <div className="flex-1 flex flex-col max-w-2xl">

          {/* Question Header */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm font-medium">Soru {currentIdx + 1} / {QUESTIONS.length}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${DIFFICULTY_COLORS[question.difficulty]}`}>
                  {question.difficulty}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                {question.category}
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

          {/* Explanation */}
          {submitted && (
            <div className={`rounded-2xl p-4 border mb-4 animate-fade-in-up ${selected === question.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined text-[18px] ${selected === question.correct ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {selected === question.correct ? 'check_circle' : 'cancel'}
                </span>
                <span className={`font-bold text-sm ${selected === question.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selected === question.correct ? 'Doğru Cevap!' : 'Yanlış Cevap'}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
            </div>
          )}

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
                {currentIdx < QUESTIONS.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
          {/* AI Tip */}
          <div className="bg-[#1E293B] border border-primary/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
              </div>
              <span className="text-primary text-sm font-bold">AI İpucu</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{question.tip}</p>
          </div>

          {/* Progress overview */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm mb-4">Sınav İlerlemesi</h3>
            <div className="space-y-2">
              {QUESTIONS.map((q, i) => {
                const ans = answers.find(a => a.questionId === q.id);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === currentIdx ? 'bg-primary text-white' :
                      ans ? (ans.selected === ans.correct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400') :
                      'bg-white/5 text-slate-500'
                    }`}>
                      {ans ? (ans.selected === ans.correct ? '✓' : '✗') : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs truncate ${i === currentIdx ? 'text-white font-semibold' : 'text-slate-500'}`}>
                        {q.category}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[q.difficulty]}`}>
                      {q.difficulty[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score so far */}
          {answers.length > 0 && (
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-slate-400 text-xs mb-1">Şimdiye Kadar</p>
              <p className="text-white text-3xl font-black">
                {answers.filter(a => a.selected === a.correct).length}/{answers.length}
              </p>
              <p className="text-slate-500 text-xs mt-1">Doğru Cevap</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default DiagnosticAssessment;
