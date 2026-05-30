import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const StatCard = ({ icon, label, value, color = 'primary', sub }) => (
  <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 flex items-start gap-4 hover:border-white/20 transition-all">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
      color === 'primary' ? 'bg-primary/20' :
      color === 'emerald' ? 'bg-emerald-500/20' :
      color === 'orange' ? 'bg-orange-500/20' : 'bg-purple-500/20'
    }`}>
      <span className={`material-symbols-outlined text-2xl ${
        color === 'primary' ? 'text-primary' :
        color === 'emerald' ? 'text-emerald-400' :
        color === 'orange' ? 'text-orange-400' : 'text-purple-400'
      }`}>{icon}</span>
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-white text-2xl font-black mt-0.5">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  </div>
);

const SkillBar = ({ name, percent, color }) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-slate-300 text-sm font-medium">{name}</span>
      <span className="text-slate-400 text-xs font-bold">{percent}%</span>
    </div>
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const firstName = user?.full_name?.split(' ')[0] || 'Öğrenci';

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6 pb-10">

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#0F172A] p-8 overflow-hidden border border-white/10">
          <div className="absolute top-[-30%] right-[-5%] w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[30%] w-60 h-60 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
                <span className="material-symbols-outlined text-emerald-400 text-sm">auto_awesome</span>
                <span className="text-white/80 text-xs font-semibold">Yapay Zeka Yol Haritanız Güncellendi</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
                Hoş geldin, {firstName}! 👋
              </h1>
              <p className="text-indigo-200/80 text-base max-w-lg">
                Bugün 2 modül tamamlaman seni hedefine %15 daha da yaklaştırıyor. Devam et!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/roadmap')}
                className="flex items-center gap-2 bg-white text-indigo-900 px-5 py-3 rounded-xl font-bold hover:bg-white/90 transition-all active:scale-95 shadow-xl"
              >
                <span className="material-symbols-outlined text-[20px]">map</span>
                Yol Haritam
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="flex items-center gap-2 bg-white/10 text-white px-5 py-3 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">school</span>
                Eğitimler
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="local_fire_department" label="Günlük Seri" value="12 Gün" color="orange" sub="En yüksek: 21 gün" />
          <StatCard icon="auto_graph" label="Genel Puan" value="78%" color="primary" sub="Son ay +12%" />
          <StatCard icon="check_circle" label="Tamamlanan" value="24 Ders" color="emerald" sub="Bu hafta 4 ders" />
          <StatCard icon="military_tech" label="Rozet" value="6 Adet" color="purple" sub="Son rozet: 2 gün önce" />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Knowledge Radar */}
          <div className="lg:col-span-2 bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-lg">Bilgi Durumu Haritası</h2>
                <p className="text-slate-400 text-sm">Konu bazlı hakimiyet seviyeniz</p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20">
                Son 30 gün
              </span>
            </div>
            <div className="space-y-4">
              <SkillBar name="Algoritmalar" percent={78} color="bg-primary" />
              <SkillBar name="Veri Yapıları" percent={91} color="bg-emerald-500" />
              <SkillBar name="Backend Geliştirme" percent={45} color="bg-orange-500" />
              <SkillBar name="Frontend Geliştirme" percent={62} color="bg-purple-500" />
              <SkillBar name="Sistem Tasarımı" percent={33} color="bg-red-500" />
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col gap-4">
            {/* AI Alert */}
            <div className="bg-gradient-to-br from-red-950/50 to-[#1E293B] border border-red-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-red-400 text-xl">warning</span>
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider">AI Uyarısı</span>
              </div>
              <h3 className="text-white font-bold text-base mb-2">Olasılık Temel Boşluğu</h3>
              <p className="text-slate-400 text-sm mb-4">Son sınavda %34 düşüş tespit edildi. İlerlemeye devam etmeden bu boşluğu kapatmanızı öneriyoruz.</p>
              <button onClick={() => navigate('/assessment/diagnostic')} className="w-full bg-red-500/20 text-red-400 border border-red-500/30 py-2 px-4 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-all">
                Şimdi Değerlendir →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-3">Hızlı Erişim</h3>
              <div className="space-y-2">
                {[
                  { icon: 'map', label: 'Öğrenme Yolum', path: '/roadmap', color: 'text-primary' },
                  { icon: 'quiz', label: 'Seviye Tespit Sınavı', path: '/assessment/diagnostic', color: 'text-emerald-400' },
                  { icon: 'bar_chart', label: 'Raporlarım', path: '/reports', color: 'text-orange-400' },
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left group"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${item.color}`}>{item.icon}</span>
                    <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">{item.label}</span>
                    <span className="material-symbols-outlined text-slate-600 text-[16px] ml-auto group-hover:text-slate-400 transition-colors">arrow_forward_ios</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Curriculum */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Aktif Müfredat</h2>
            <button onClick={() => navigate('/courses')} className="text-primary text-sm font-semibold hover:text-indigo-300 transition-colors flex items-center gap-1">
              Tümünü Gör
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'İleri Seviye Graph Teorisi', instructor: 'Dr. Sarah Chen', enrolled: '1,240', tag: 'ZORUNLU', tagColor: 'text-red-400 bg-red-500/10 border-red-500/20', gradient: 'from-blue-600 to-indigo-900', progress: 65 },
              { title: 'Sistem Tasarımı Masterclass', instructor: 'Marcus Reed', enrolled: '8,902', tag: 'TREND', tagColor: 'text-primary bg-primary/10 border-primary/20', gradient: 'from-purple-600 to-fuchsia-900', progress: 30 },
              { title: 'Kriptografiye Giriş', instructor: 'Prof. Alan Turing', enrolled: '456', tag: 'SEÇMELİ', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', gradient: 'from-emerald-600 to-teal-900', progress: 10 },
            ].map((course) => (
              <div key={course.title} className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
                <div className={`h-32 bg-gradient-to-br ${course.gradient} relative`}>
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${course.tagColor}`}>{course.tag}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs font-bold">
                    %{course.progress} tamamlandı
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-white font-bold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h4>
                  <p className="text-slate-400 text-xs mb-3">{course.instructor}</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                      {course.enrolled} kayıtlı
                    </span>
                    <button className="text-primary text-xs font-bold hover:text-indigo-300 transition-colors">Devam Et →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
