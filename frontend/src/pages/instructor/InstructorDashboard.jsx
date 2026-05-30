import useAuthStore from '../../store/authStore';

const StatCard = ({ icon, label, value, color, delta }) => (
  <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      {delta && (
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
  const { user } = useAuthStore();
  const firstName = user?.full_name?.split(' ')[0] || 'Eğitmen';

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
                Bu ay 1,248 öğrenci derslerinizi takip ediyor. Gelir $3,450 ile rekor seviyede.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Yeni Kurs Oluştur
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="group" label="Toplam Öğrenci" value="1,248" color="bg-primary/20 text-primary" delta={12} />
          <StatCard icon="star" label="Ortalama Puan" value="4.8 / 5.0" color="bg-yellow-500/20 text-yellow-400" delta={3} />
          <StatCard icon="payments" label="Aylık Gelir" value="$3,450" color="bg-emerald-500/20 text-emerald-400" delta={18} />
          <StatCard icon="video_library" label="Aktif Kurs" value="5 Kurs" color="bg-purple-500/20 text-purple-400" />
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
              {[
                { name: 'İleri Düzey Python', students: 124, rating: 4.9, revenue: '$890', progress: 91 },
                { name: 'Siber Güvenliğe Giriş', students: 342, rating: 4.8, revenue: '$1,540', progress: 78 },
                { name: 'Web Geliştirme Bootcamp', students: 89, rating: 4.7, revenue: '$620', progress: 65 },
                { name: 'Makine Öğrenmesi Temelleri', students: 212, rating: 4.6, revenue: '$400', progress: 48 },
              ].map((course) => (
                <div key={course.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[18px]">laptop_chromebook</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{course.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="text-slate-500 text-xs shrink-0">{course.progress}%</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-emerald-400 font-bold text-sm">{course.revenue}</p>
                    <p className="text-slate-500 text-xs">{course.students} öğrenci</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">Son Yorumlar</h2>
            <div className="space-y-4">
              {[
                { name: 'Ahmet Y.', stars: 5, comment: 'Python kursunuz harika! Ders notlarını indirip çalışmak çok faydalı oldu.', time: '2 saat önce' },
                { name: 'Ayşe D.', stars: 4, comment: 'Anlatım çok akıcı ancak pratik örnekleri artırabilirsiniz.', time: 'Dün' },
                { name: 'Mehmet K.', stars: 5, comment: 'AI destekli yol haritası gerçekten işe yarıyor. Teşekkürler!', time: '3 gün önce' },
              ].map((review) => (
                <div key={review.name} className="p-3 bg-white/5 rounded-xl border border-white/5">
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
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstructorDashboard;
