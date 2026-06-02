import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import api from '../../lib/api';

const CodingExercise = () => {
  const { courseId, exerciseId } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['codingExercises', courseId],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}/coding-exercises`);
      return res.data;
    }
  });

  const exercise = exercises.find((ex) => ex.id === exerciseId);

  useEffect(() => {
    if (exercise && !code) {
      setTimeout(() => setCode(exercise.initial_code || ''), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise]);

  const handleRunCode = async () => {
    if (!code.trim() || !exercise) return;
    setIsRunning(true);
    setOutput("Çalıştırılıyor...\n");
    setIsSuccess(false);

    try {
      const response = await api.post('/courses/execute', {
        language: exercise.language,
        code: code
      });

      const result = response.data;

      if (result.compile && result.compile.code !== 0) {
        setOutput(`Derleme Hatası:\n${result.compile.output}`);
      } else if (result.run) {
        const runOutput = result.run.output;
        setOutput(runOutput);
        
        // Validate with test_code
        if (exercise.test_code && runOutput.trim().includes(exercise.test_code.trim())) {
          setIsSuccess(true);
          // Award XP via API (Optional extension)
        }
      } else {
        setOutput("Bilinmeyen bir hata oluştu.");
      }
    } catch (err) {
      setOutput(`Bağlantı Hatası: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center gap-4 text-white">
        <h2 className="text-xl font-bold text-error">Görev bulunamadı!</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-primary rounded-lg font-bold">Geri Dön</button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0F172A] text-slate-300 overflow-hidden">
      
      {/* Header */}
      <div className="h-16 shrink-0 bg-[#1E293B] border-b border-white/10 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/courses/${courseId}`)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          <div>
            <h1 className="text-white font-bold">{exercise.title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Dil:</span>
              <span className="text-xs font-bold text-primary uppercase">{exercise.language}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]">lightbulb</span>
            İpucu İste
          </button>
          <button 
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            {isRunning ? "Çalışıyor..." : "Kodu Çalıştır"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Question */}
        <div className="w-[400px] shrink-0 border-r border-white/10 flex flex-col bg-[#111827] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <span className="material-symbols-outlined text-2xl">assignment</span>
              </div>
              <h2 className="text-xl font-bold text-white">Görev Detayı</h2>
            </div>
            
            <div className="prose prose-invert prose-emerald prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
              <div dangerouslySetInnerHTML={{ 
                __html: exercise.description
                  .replace(/\n/g, '<br/>')
                  .replace(/`([^`]+)`/g, '<code class="bg-black/30 text-emerald-400 px-1 py-0.5 rounded">$1</code>')
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
              }} />
            </div>

            {isSuccess && (
              <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-4xl text-emerald-400 mb-2">task_alt</span>
                <h3 className="text-emerald-400 font-bold text-lg">Harika İş Çıkardın!</h3>
                <p className="text-sm text-emerald-500/80 mt-1">Görevi başarıyla tamamladın. XP kazandın!</p>
                <button onClick={() => navigate(`/courses/${courseId}`)} className="mt-4 w-full py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors">
                  Derse Dön
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Editor & Console */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={exercise.language}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                renderWhitespace: "selection"
              }}
            />
          </div>

          {/* Console */}
          <div className="h-[250px] shrink-0 bg-[#0A0F18] border-t border-white/10 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-[#0F172A]">
              <span className="material-symbols-outlined text-[16px] text-slate-400">terminal</span>
              <span className="text-xs font-bold text-slate-400 tracking-wider">TERMINAL ÇIKTISI</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
              {output ? (
                <pre className={`whitespace-pre-wrap ${isSuccess ? 'text-emerald-400' : (output.includes('Hatası') ? 'text-error' : 'text-slate-300')}`}>
                  {output}
                </pre>
              ) : (
                <div className="text-slate-600 italic">Kodu çalıştırdığınızda çıktı burada görünecektir...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingExercise;
