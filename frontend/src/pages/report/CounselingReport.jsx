import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const RadarChart = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  const cx = 160, cy = 160, r = 110;
  const n = skills.length;
  const angleStep = (2 * Math.PI) / n;
  const getPoint = (angle, radius) => ({
    x: cx + radius * Math.cos(angle - Math.PI / 2),
    y: cy + radius * Math.sin(angle - Math.PI / 2),
  });

  const initialPoints = skills.map((s, i) => {
    const p = getPoint(i * angleStep, (s.initial / 100) * r);
    return `${p.x},${p.y}`;
  }).join(' ');

  const currentPoints = skills.map((s, i) => {
    const p = getPoint(i * angleStep, (s.current / 100) * r);
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-[280px] mx-auto">
      {/* Grid rings */}
      {[25, 50, 75, 100].map(pct => {
        const pts = skills.map((_, i) => {
          const p = getPoint(i * angleStep, (pct / 100) * r);
          return `${p.x},${p.y}`;
        }).join(' ');
        return <polygon key={pct} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}

      {/* Axis lines */}
      {skills.map((_, i) => {
        const outer = getPoint(i * angleStep, r);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}

      {/* Initial state */}
      <polygon points={initialPoints} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

      {/* Current mastery */}
      <polygon points={currentPoints} fill="rgba(26,86,219,0.2)" stroke="#1A56DB" strokeWidth="2" />

      {/* Dots */}
      {skills.map((s, i) => {
        const p = getPoint(i * angleStep, (s.current / 100) * r);
        return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#1A56DB" />;
      })}

      {/* Labels */}
      {skills.map((s, i) => {
        const p = getPoint(i * angleStep, r + 20);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(148,163,184,1)" fontSize="11" fontFamily="Inter" fontWeight="500">
            {s.name}
          </text>
        );
      })}
    </svg>
  );
};

const Reports = () => {
  const navigate = useNavigate();

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['global-report'],
    queryFn: async () => {
      const res = await api.get('/ai/report/global');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
         <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-primary text-2xl">psychology</span>
          </div>
         <h2 className="text-xl font-bold text-white mb-2">Yapay Zeka Eğitim Analizinizi Oluşturuyor...</h2>
         <p className="text-slate-400 text-sm max-w-sm">
           Tüm kurslarınızdaki ilerlemeniz değerlendiriliyor ve size özel bir rapor hazırlanıyor. Bu işlem birkaç saniye sürebilir.
         </p>
      </div>
    );
  }

  if (error || !report) {
    return <div className="p-8 text-center text-error font-bold">Rapor oluşturulurken bir hata meydana geldi.</div>;
  }

  if (!report.has_data) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-4xl">menu_book</span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Henüz Eğitim Verisi Yok</h2>
        <p className="text-slate-400 text-sm max-w-md mb-8">
          {report.message || "Öğrenme yolculuğu raporunuzu oluşturabilmemiz için öncelikle birkaç kursa kayıt olmanız ve ilerleme kaydetmeniz gerekiyor."}
        </p>
        <button
          onClick={() => navigate('/courses')}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/80 transition-colors flex items-center gap-2"
        >
          Eğitimleri Keşfet
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    );
  }

  const { stats, skills, competencies, recommendations, detailed_narrative } = report;

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6 pb-10">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold">Güz Dönemi Analizi Güncel</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Öğrenme Yolculuğu Raporu</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Teknik yetkinliklerinizin kapsamlı analizi, beceri gelişimi ve yapay zeka tarafından önerilen sonraki adımlar.
            </p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all text-sm active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Yeni Eğitimler Keşfet
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Radar Chart */}
          <div className="lg:col-span-7 bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-lg">Beceri Boşluğu Analizi</h2>
                <p className="text-slate-400 text-sm">Başlangıç ve güncel hakimiyet karşılaştırması</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1.5 rounded-full bg-white/20 inline-block" />
                  <span className="text-slate-400 text-xs">Başlangıç</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1.5 rounded-full bg-primary inline-block" />
                  <span className="text-slate-400 text-xs">Güncel</span>
                </div>
              </div>
            </div>
            <RadarChart skills={skills} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Mastery Stats */}
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5">
              <h2 className="text-white font-bold text-base mb-4">Hakimiyet İstatistikleri</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                  <span className="material-symbols-outlined text-primary text-2xl mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                  <p className="text-primary text-2xl font-black">{stats?.coding_fluency || 0}%</p>
                  <p className="text-slate-400 text-xs mt-1">Kodlama Akıcılığı Artışı</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                  <span className="material-symbols-outlined text-emerald-400 text-2xl mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                  <p className="text-emerald-400 text-2xl font-black">{stats?.completion_rate || 0}%</p>
                  <p className="text-slate-400 text-xs mt-1">Genel Tamamlanma Oranı</p>
                </div>
              </div>
            </div>

            {/* Competency Checklist */}
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 flex-1 overflow-y-auto max-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-base">Yetkinlik Listesi</h2>
                <span className="text-xs font-bold px-2 py-1 bg-white/5 text-slate-400 rounded-lg border border-white/10">
                  {competencies?.filter(c => c.done).length || 0}/{competencies?.length || 0} Temel
                </span>
              </div>
              <ul className="space-y-3">
                {competencies?.map((c, i) => (
                  <li key={i} className={`flex items-start gap-3 ${!c.done ? 'opacity-60' : ''}`}>
                    <span
                      className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${c.done ? 'text-emerald-400' : 'text-slate-500'}`}
                      style={{ fontVariationSettings: c.done ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {c.done ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${c.done ? 'text-white' : 'text-slate-400'}`}>{c.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{c.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Skill Progress Bars */}
        <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-5">Beceri Gelişim Detayı</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skills?.map(skill => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm font-medium">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-xs">{skill.initial}% → </span>
                    <span className="text-white text-sm font-bold">{skill.current}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${skill.current}%`, backgroundColor: skill.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Detailed Narrative */}
        {detailed_narrative && (
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-primary/20 rounded-2xl p-6 relative overflow-hidden mt-6 mb-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">psychology</span>
              </div>
              <h2 className="text-xl font-bold text-white">Yapay Zeka Danışmanınız Diyor Ki:</h2>
            </div>
            <div className="relative z-10 prose prose-invert prose-emerald max-w-none prose-p:leading-relaxed prose-strong:text-white">
              <div dangerouslySetInnerHTML={{ 
                  __html: detailed_narrative
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>') 
                }} 
              />
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">Yapay Zeka Önerilen Sonraki Adımlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations?.map((rec) => (
              <div 
                key={rec.title} 
                onClick={() => navigate('/courses')}
                className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-2xl transition-colors">{rec.icon}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${rec.color || 'border-white/20 text-white bg-white/10'}`}>{rec.tag}</span>
                  <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-[18px]">arrow_forward</span>
                </div>
                <h3 className="text-white font-bold text-sm mb-2 group-hover:text-primary transition-colors">{rec.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
