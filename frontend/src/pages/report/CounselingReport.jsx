import { useNavigate } from 'react-router-dom';

const SKILLS = [
  { name: 'Algoritmalar', initial: 38, current: 78, color: '#1A56DB' },
  { name: 'Veri Yapıları', initial: 55, current: 91, color: '#10B981' },
  { name: 'Backend', initial: 20, current: 45, color: '#F59E0B' },
  { name: 'Frontend', initial: 30, current: 62, color: '#8B5CF6' },
  { name: 'Test', initial: 15, current: 50, color: '#06B6D4' },
  { name: 'Sistem Tasarımı', initial: 10, current: 33, color: '#EC4899' },
];

const COMPETENCIES = [
  { label: 'İleri Graf Algoritmaları', detail: "Dijkstra's ve A* implementasyonları tamamlandı.", done: true },
  { label: 'React State Yönetimi', detail: 'Context API ve Redux Toolkit kullanımı öğrenildi.', done: true },
  { label: 'RESTful API Tasarımı', detail: 'HTTP fiilleri ve durum kodları doğru uygulanıyor.', done: true },
  { label: 'Mikroservis Mimarisi', detail: 'Servisler arası iletişim geliştirilmeli. Devam ediyor.', done: false },
  { label: 'CI/CD ve DevOps', detail: 'Pipeline kurulumu henüz başlanmadı.', done: false },
];

const RECOMMENDATIONS = [
  { tag: 'AI Ethics', color: 'text-primary bg-primary/10 border-primary/20', title: 'AI Etiği III', desc: 'Önyargı azaltma ve üretim ML sistemleri için şeffaf modelleme teknikleri.', icon: 'policy' },
  { tag: 'Capstone', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', title: 'Gerçek Dünya Projesi', desc: 'Mikroservis mimarisindeki boşluğu kapatmak için startup ortamı simülasyonu.', icon: 'architecture' },
  { tag: 'Altyapı', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', title: 'Cloud Deployment Ops', desc: 'Container orkestrasyonu ve CI/CD pipeline\'larında ustalaş.', icon: 'cloud' },
];

const RadarChart = () => {
  const cx = 160, cy = 160, r = 110;
  const n = SKILLS.length;
  const angleStep = (2 * Math.PI) / n;
  const getPoint = (angle, radius) => ({
    x: cx + radius * Math.cos(angle - Math.PI / 2),
    y: cy + radius * Math.sin(angle - Math.PI / 2),
  });

  const initialPoints = SKILLS.map((s, i) => {
    const p = getPoint(i * angleStep, (s.initial / 100) * r);
    return `${p.x},${p.y}`;
  }).join(' ');

  const currentPoints = SKILLS.map((s, i) => {
    const p = getPoint(i * angleStep, (s.current / 100) * r);
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-[280px] mx-auto">
      {/* Grid rings */}
      {[25, 50, 75, 100].map(pct => {
        const pts = SKILLS.map((_, i) => {
          const p = getPoint(i * angleStep, (pct / 100) * r);
          return `${p.x},${p.y}`;
        }).join(' ');
        return <polygon key={pct} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}

      {/* Axis lines */}
      {SKILLS.map((_, i) => {
        const outer = getPoint(i * angleStep, r);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}

      {/* Initial state */}
      <polygon points={initialPoints} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

      {/* Current mastery */}
      <polygon points={currentPoints} fill="rgba(26,86,219,0.2)" stroke="#1A56DB" strokeWidth="2" />

      {/* Dots */}
      {SKILLS.map((s, i) => {
        const p = getPoint(i * angleStep, (s.current / 100) * r);
        return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#1A56DB" />;
      })}

      {/* Labels */}
      {SKILLS.map((s, i) => {
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

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6 pb-10">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold">Güz Dönemi Tamamlandı</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Öğrenme Yolculuğu Raporu</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Teknik yetkinliklerinin kapsamlı analizi, beceri gelişimi ve yapay zeka tarafından önerilen sonraki adımlar.
            </p>
          </div>
          <button
            onClick={() => navigate('/assessment/diagnostic')}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all text-sm active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            Yeni Değerlendirme
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
            <RadarChart />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Mastery Stats */}
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5">
              <h2 className="text-white font-bold text-base mb-4">Hakimiyet İstatistikleri</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                  <span className="material-symbols-outlined text-primary text-2xl mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                  <p className="text-primary text-2xl font-black">92%</p>
                  <p className="text-slate-400 text-xs mt-1">Kodlama Akıcılığı Artışı</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                  <span className="material-symbols-outlined text-emerald-400 text-2xl mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                  <p className="text-emerald-400 text-2xl font-black">85%</p>
                  <p className="text-slate-400 text-xs mt-1">Genel Tamamlanma Oranı</p>
                </div>
              </div>
            </div>

            {/* Competency Checklist */}
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-base">Yetkinlik Listesi</h2>
                <span className="text-xs font-bold px-2 py-1 bg-white/5 text-slate-400 rounded-lg border border-white/10">
                  {COMPETENCIES.filter(c => c.done).length}/{COMPETENCIES.length} Temel
                </span>
              </div>
              <ul className="space-y-3">
                {COMPETENCIES.map((c, i) => (
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
            {SKILLS.map(skill => (
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

        {/* Recommendations */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">Yapay Zeka Önerilen Sonraki Adımlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDATIONS.map((rec) => (
              <div key={rec.title} className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-2xl transition-colors">{rec.icon}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${rec.color}`}>{rec.tag}</span>
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
