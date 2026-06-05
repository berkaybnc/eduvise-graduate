import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';
import CertificateGenerator from '../../components/CertificateGenerator';

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
  
  const [selectedCert, setSelectedCert] = useState(null);

  const { data: enrolledCourses = [], isLoading } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: async () => {
      const res = await api.get('/courses/enrolled');
      return res.data;
    }
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: async () => {
      const res = await api.get('/courses/my-certificates');
      return res.data;
    }
  });

  // Calculate real stats from enrolledCourses
  const totalCourses = enrolledCourses.length;
  let totalVideosAll = 0;
  let totalCompletedAll = 0;
  let completedCoursesCount = 0;
  const categoryProgress = {};

  enrolledCourses.forEach(enrollment => {
    const course = enrollment.course;
    const totalVideos = course.sections?.reduce((acc, s) => acc + (s.videos?.length || 0), 0) || 0;
    const completed = enrollment.completed_videos?.length || 0;
    const progress = totalVideos === 0 ? 0 : Math.round((completed / totalVideos) * 100);

    totalVideosAll += totalVideos;
    totalCompletedAll += completed;

    if (totalVideos > 0 && completed === totalVideos) {
      completedCoursesCount++;
    }

    if (course.category) {
      if (!categoryProgress[course.category]) {
        categoryProgress[course.category] = { totalProg: 0, count: 0 };
      }
      categoryProgress[course.category].totalProg += progress;
      categoryProgress[course.category].count++;
    }
  });

  const overallProgress = totalVideosAll === 0 ? 0 : Math.round((totalCompletedAll / totalVideosAll) * 100);

  const colors = ['bg-primary', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500', 'bg-blue-500'];
  const skills = Object.entries(categoryProgress).map(([cat, data], idx) => ({
    name: cat,
    percent: Math.round(data.totalProg / data.count),
    color: colors[idx % colors.length]
  }));

  const inProgressCourses = enrolledCourses.map(e => {
    const course = e.course;
    const totalVideos = course.sections?.reduce((acc, s) => acc + (s.videos?.length || 0), 0) || 0;
    const completed = e.completed_videos?.length || 0;
    const progress = totalVideos === 0 ? 0 : Math.round((completed / totalVideos) * 100);
    return { ...e, progress };
  }).filter(c => c.progress > 0 && c.progress < 100).sort((a,b) => a.progress - b.progress);

  const suggestedCourse = inProgressCourses[0] || null;

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
                <span className="text-white/80 text-xs font-semibold">Öğrenme İstatistikleriniz Güncellendi</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
                Hoş geldin, {firstName}! 👋
              </h1>
              <p className="text-indigo-200/80 text-base max-w-lg">
                Bugüne kadar {totalCompletedAll} video tamamladın. Öğrenmeye devam et ve hedeflerine ulaş!
              </p>
            </div>
            <div className="flex gap-3">
              {suggestedCourse && (
                <button
                  onClick={() => navigate(`/courses/${suggestedCourse.course.id}`)}
                  className="flex items-center gap-2 bg-white text-indigo-900 px-5 py-3 rounded-xl font-bold hover:bg-white/90 transition-all active:scale-95 shadow-xl"
                >
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  Derse Dön
                </button>
              )}
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
          <StatCard icon="school" label="Kayıtlı Kurslar" value={totalCourses.toString()} color="orange" sub="Toplam eğitime kayıt" />
          <StatCard icon="auto_graph" label="Genel İlerleme" value={`%${overallProgress}`} color="primary" sub="Tüm kursların ortalaması" />
          <StatCard icon="play_circle" label="Tamamlanan Video" value={totalCompletedAll.toString()} color="emerald" sub={`Toplam ${totalVideosAll} üzerinden`} />
          <StatCard icon="military_tech" label="Bitirilen Kurs" value={completedCoursesCount.toString()} color="purple" sub="Başarıyla tamamlandı" />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Knowledge Radar */}
          <div className="lg:col-span-2 bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-lg">Kategori İlerleme Haritası</h2>
                <p className="text-slate-400 text-sm">Kategori bazlı hakimiyet seviyeniz</p>
              </div>
            </div>
            <div className="space-y-4">
              {skills.length > 0 ? (
                skills.map(skill => (
                  <SkillBar key={skill.name} name={skill.name} percent={skill.percent} color={skill.color} />
                ))
              ) : (
                <div className="text-slate-400 text-center py-6">Kayıtlı kursunuz bulunmadığı için istatistik gösterilemiyor.</div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col gap-4">
            {/* AI Alert */}
            {suggestedCourse ? (
              <div className="bg-gradient-to-br from-indigo-950/50 to-[#1E293B] border border-primary/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">Tavsiye</span>
                </div>
                <h3 className="text-white font-bold text-base mb-2">Eğitiminize Devam Edin</h3>
                <p className="text-slate-400 text-sm mb-4">
                  <strong>{suggestedCourse.course.title}</strong> eğitiminde %{suggestedCourse.progress} aşamasındasınız.
                </p>
                <button onClick={() => navigate(`/courses/${suggestedCourse.course.id}`)} className="w-full bg-primary/20 text-primary border border-primary/30 py-2 px-4 rounded-xl text-sm font-bold hover:bg-primary/30 transition-all">
                  Derse Git →
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-indigo-950/50 to-[#1E293B] border border-primary/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-xl">explore</span>
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">Keşfet</span>
                </div>
                <h3 className="text-white font-bold text-base mb-2">Yeni Eğitimler Keşfedin</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Marketplace'te sizin için yeni kurslar var.
                </p>
                <button onClick={() => navigate('/courses')} className="w-full bg-primary/20 text-primary border border-primary/30 py-2 px-4 rounded-xl text-sm font-bold hover:bg-primary/30 transition-all">
                  Kurslara Göz At →
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-3">Hızlı Erişim</h3>
              <div className="space-y-2">
                {[
                  { icon: 'school', label: 'Tüm Eğitimlerim', path: '/courses', color: 'text-primary' },
                  { icon: 'explore', label: 'Eğitim Keşfet', path: '/courses', color: 'text-emerald-400' },
                ].map(item => (
                  <button
                    key={item.label}
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
            {isLoading ? (
               <div className="col-span-3 flex justify-center py-10"><span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span></div>
            ) : enrolledCourses.length === 0 ? (
               <div className="col-span-3 text-center py-10 text-slate-400">Henüz hiçbir eğitime kayıtlı değilsiniz. <button onClick={() => navigate('/courses')} className="text-primary hover:underline ml-2">Eğitimleri Keşfet</button></div>
            ) : enrolledCourses.map((enrollment) => {
              const course = enrollment.course;
              const totalVideos = course.sections?.reduce((acc, s) => acc + (s.videos?.length || 0), 0) || 0;
              const completed = enrollment.completed_videos?.length || 0;
              const progress = totalVideos === 0 ? 0 : Math.round((completed / totalVideos) * 100);
              
              return (
              <div key={course.id} onClick={() => navigate(`/courses/${course.id}`)} className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
                <div className={`h-32 relative bg-gradient-to-br from-slate-700 to-slate-900`}>
                  {course.thumbnail_url && (
                    <img src={course.thumbnail_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${course.thumbnail_url}` : course.thumbnail_url} alt="Kapak" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border text-primary bg-primary/10 border-primary/20`}>{course.category}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs font-bold">
                    %{progress} tamamlandı
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-white font-bold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h4>
                  <p className="text-slate-400 text-xs mb-3">Seviye: {course.level}</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">play_circle</span>
                      {completed} / {totalVideos} Video
                    </span>
                    <button className="text-primary text-xs font-bold hover:text-indigo-300 transition-colors">Devam Et →</button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Badges Section */}
        {user?.badges && user.badges.length > 0 && (
          <div className="mt-8">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-400">military_tech</span>
              Kazanılan Rozetler
            </h2>
            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4">
              {user.badges.map((badge, idx) => (
                <div key={idx} className="shrink-0 bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[140px] hover:border-white/20 transition-all shadow-xl group">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className={`material-symbols-outlined text-4xl ${badge.color || 'text-white'}`}>{badge.icon || 'military_tech'}</span>
                  </div>
                  <h4 className="text-white font-bold text-sm text-center">{badge.name}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <div className="mt-8">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">workspace_premium</span>
              Kazanılan Sertifikalar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map(cert => (
                <div key={cert.id} className="bg-gradient-to-br from-[#1E293B] to-slate-900 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
                      <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm line-clamp-1">{cert.course_title}</h4>
                      <p className="text-slate-400 text-xs">Sertifika Kodu: {cert.certificate_code}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCert(cert)}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {selectedCert && (
        <CertificateGenerator
          courseTitle={selectedCert.course_title}
          instructorName={selectedCert.instructor_name}
          certificateCode={selectedCert.certificate_code}
          issuedAt={selectedCert.issued_at}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
