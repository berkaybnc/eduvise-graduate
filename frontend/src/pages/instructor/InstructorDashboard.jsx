import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

const StatCard = ({ icon, label, value, color, delta }) => (
  <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      {delta != null && (
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${delta > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {delta > 0 ? '+' : ''}{delta}%
        </span>
      )}
    </div>
    <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
    <p className="text-white text-2xl font-black">{value}</p>
  </div>
);

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const firstName = user?.full_name?.split(' ')[0] || 'Eğitmen';
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get('/instructor/stats');
        if (!cancelled) setStats(statsRes.data);
        
        // Fetch AI Insights in parallel or sequentially
        try {
          const insightsRes = await api.get('/instructor/ai-insights');
          if (!cancelled) setInsights(insightsRes.data.report);
        } catch (err) {
          console.error("AI Insights hatası:", err);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    fetchDashboardData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <span className="material-symbols-outlined text-emerald-500 text-5xl animate-spin">progress_activity</span>
      </div>
    );
  }

  const safeStats = stats || {
    total_students: 0,
    average_rating: 0.0,
    monthly_revenue: 0,
    active_courses: 0,
    course_performance: [],
    recent_reviews: []
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6 pb-10">

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#0F172A] p-8 overflow-hidden border border-emerald-500/20">
          <div className="absolute top-[-20%] right-[-5%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
                <span className="material-symbols-outlined text-emerald-400 text-sm">trending_up</span>
                <span className="text-white/80 text-xs font-semibold">Bu ay rekor kırdınız! 🎉</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
                Merhaba, {firstName}! 🏆
              </h1>
              <p className="text-emerald-200/80 text-base max-w-lg">
                Şu ana kadar {safeStats.total_students} öğrenci derslerinizi takip ediyor. Toplam geliriniz ₺{safeStats.monthly_revenue.toLocaleString()}.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/instructor/courses', { state: { openCreateTab: true } })}
                className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Yeni Kurs Oluştur
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="group" label="Toplam Öğrenci" value={safeStats.total_students.toLocaleString()} color="bg-primary/20 text-primary" />
          <StatCard icon="star" label="Ortalama Puan" value={`${safeStats.average_rating.toFixed(1)} / 5.0`} color="bg-yellow-500/20 text-yellow-400" />
          <StatCard icon="payments" label="Toplam Gelir" value={`₺${safeStats.monthly_revenue.toLocaleString()}`} color="bg-emerald-500/20 text-emerald-400" />
          <StatCard icon="video_library" label="Aktif Kurs" value={`${safeStats.active_courses} Kurs`} color="bg-purple-500/20 text-purple-400" />
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Course Performance */}
          <div className="lg:col-span-2 bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Kurs Performansı</h2>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">Son 30 gün</span>
            </div>
            <div className="space-y-4">
              {safeStats.course_performance.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">Henüz kurs verisi bulunmuyor.</p>
              ) : (
                safeStats.course_performance.map((course) => (
                  <div key={course.id || course.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[18px]">laptop_chromebook</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{course.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-slate-500 text-xs shrink-0 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {course.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-emerald-400 font-bold text-sm">{course.revenue}</p>
                      <p className="text-slate-500 text-xs">{course.students} öğrenci</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">Son Yorumlar</h2>
            <div className="space-y-4">
              {safeStats.recent_reviews.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">Henüz yorum yapılmamış.</p>
              ) : (
                safeStats.recent_reviews.map((review, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {review.name[0]}
                        </div>
                        <span className="text-white text-sm font-semibold">{review.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: review.stars }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-yellow-400 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{review.comment}</p>
                    <p className="text-slate-600 text-[10px] mt-1.5">{review.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 relative z-10">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
            Yapay Zeka Asistanınız Diyor ki:
          </h2>
          <div className="relative z-10">
            {insights ? (
              <div className="prose prose-invert prose-emerald max-w-none prose-headings:text-white prose-strong:text-white prose-a:text-emerald-400">
                <div dangerouslySetInnerHTML={{ 
                  __html: insights
                    .replace(/### (.*?)\n/g, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>') 
                }} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-3 opacity-50">analytics</span>
                <p>Verileriniz analiz ediliyor veya yeterli veri bulunmuyor...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstructorDashboard;
