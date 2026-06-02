import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const CATEGORIES = [
  { id: 'all', label: 'Tüm Eğitimler', icon: 'grid_view' },
  { id: 'Siber Güvenlik', label: 'Siber Güvenlik', icon: 'security' },
  { id: 'Yazılım', label: 'Yazılım', icon: 'code' },
  { id: 'Veri Bilimi', label: 'Veri Bilimi', icon: 'database' },
  { id: 'Yapay Zeka', label: 'Yapay Zeka', icon: 'psychology' },
  { id: 'Tasarım', label: 'Tasarım', icon: 'palette' }
];

export const Marketplace = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get('/courses/');
      return response.data;
    }
  });

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-6 lg:px-12 overflow-hidden">
        {/* Dekoratif Gradient Arka Plan */}
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#14B8A6]/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="material-symbols-outlined text-emerald-400 text-sm">auto_awesome</span>
            <span className="text-sm font-semibold text-white/90">Yapay Zeka Destekli Öğrenme</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Yeni Nesil <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#3B82F6]">Eğitim Pazarı</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl font-medium">
            Senin bilgi seviyene göre otomatik adapte olan, sadece ihtiyacın olanı öğreten kişiselleştirilmiş eğitimleri keşfet.
          </p>
        </div>
      </div>

      {/* Categories & Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20">
        
        {/* Kategori Filtreleri */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-8 scrollbar-hide animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === cat.id 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Kurs Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error && !courses ? (
          <div className="text-error bg-error/10 p-6 rounded-2xl border border-error/20 font-bold">Eğitimler yüklenirken bir sorun oluştu.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses?.filter(c => selectedCategory === 'all' || c.category === selectedCategory).map((course, idx) => (
              <div 
                key={course.id} 
                onClick={() => navigate(`/courses/${course.id}`)}
                className="group relative bg-[#1E293B] border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }}
              >
                {/* Kart Hover Efekti Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-transparent transition-all duration-500 z-0"></div>
                
                {/* Kurs Görseli */}
                <div className={`h-48 w-full relative z-10 overflow-hidden ${course.thumbnail_url ? '' : `bg-gradient-to-br ${course.image || 'from-slate-700 to-slate-900'}`}`}>
                  {course.thumbnail_url && (
                    <img src={course.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${course.thumbnail_url}` : course.thumbnail_url} alt="Kapak" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-1 z-20">
                    <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                    <span className="text-white text-xs font-bold">{course.reviews?.length > 0 ? (course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length).toFixed(1) : '5.0'}</span>
                  </div>
                  
                  {/* Hover Image Scale */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>

                {/* İçerik */}
                <div className="p-6 relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-semibold text-emerald-400">
                      {course.level || 'Tüm Seviyeler'}
                    </span>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                      {course.students || 0} Öğrenci
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                    Bu eğitim, seviye tespit (Diagnostic) sınavınız sonucunda yapay zeka tarafından size özel olarak yeniden yapılandırılacaktır.
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-white font-bold">Ücretsiz Dene</span>
                    <button className="w-10 h-10 rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
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

export default Marketplace;
