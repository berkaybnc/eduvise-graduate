import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const InstructorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.get(`/instructor/${id}/profile`)
      .then(res => {
        if (!cancelled) {
          setProfile(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err?.response?.data?.detail || 'Eğitmen profili yüklenemedi.');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <span className="material-symbols-outlined text-emerald-500 text-5xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#0F172A] gap-4">
        <span className="material-symbols-outlined text-red-500 text-6xl">error</span>
        <h2 className="text-white text-2xl font-bold">Hata</h2>
        <p className="text-slate-400">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-semibold">
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Profil Başlığı */}
      <div className="bg-[#1E293B] border-b border-white/5 pt-20 pb-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0F172A] shadow-2xl overflow-hidden shrink-0 bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center">
            {profile.avatar_url ? (
              <img src={profile.avatar_url.startsWith('/uploads') ? `http://localhost:8000${profile.avatar_url}` : profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-5xl font-black">{profile.full_name[0]}</span>
            )}
          </div>
          
          {/* Eğitmen Bilgileri */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Doğrulanmış Eğitmen
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{profile.full_name}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm text-slate-400 mb-6 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">group</span>
                <span className="text-white">{profile.total_students.toLocaleString()}</span> Öğrenci
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-yellow-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-white">{profile.average_rating}</span> ({profile.total_reviews} Değerlendirme)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-purple-400 text-[18px]">video_library</span>
                <span className="text-white">{profile.courses.length}</span> Kurs
              </div>
            </div>
            
            <div className="bg-[#0F172A] p-5 rounded-2xl border border-white/5 shadow-inner">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                Hakkında
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Eğitmenin Kursları */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-500">school</span>
          Eğitmenin Kursları
        </h2>
        
        {profile.courses.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
            <span className="material-symbols-outlined text-slate-500 text-5xl mb-4">inventory_2</span>
            <p className="text-slate-400 font-medium">Bu eğitmen henüz bir kurs yayınlamamış.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.courses.map(course => (
              <div key={course.id} onClick={() => navigate(`/course/${course.id}`)} className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group">
                <div className={`h-40 relative overflow-hidden ${course.thumbnail_url ? '' : 'bg-gradient-to-br from-slate-800 to-black'}`}>
                  {course.thumbnail_url && (
                    <img src={course.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${course.thumbnail_url}` : course.thumbnail_url} alt="Kapak" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                    {course.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-emerald-500 transition-colors">{course.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-yellow-400 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-yellow-400 font-bold text-xs">
                        {course.reviews?.length ? (course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length).toFixed(1) : 'Yeni'}
                      </span>
                    </div>
                    <span className="text-white font-black">{course.price === 0 ? 'Ücretsiz' : `₺${course.price}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorProfile;
