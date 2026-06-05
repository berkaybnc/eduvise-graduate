import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const CATEGORIES = [
  {
    name: 'Yazılım Dünyası',
    subCategories: [
      'Blok Zincir', 'İş Zekası ve Raporlama', 'Mobil Uygulama', 'Oyun Geliştirme',
      'Programlama Dilleri', 'Veri Bilimi', 'Veri Tabanı', 'Yazılım Testi',
      'Web Geliştirme', 'DevOps'
    ]
  },
  {
    name: 'Yapay Zekâ Dünyası',
    subCategories: ['Geliştirme', 'Üretken Yapay Zekâ', 'Beşeri ve Sosyal']
  },
  {
    name: 'Sistem Dünyası',
    subCategories: ['İşletim Sistemleri', 'Siber Güvenlik', 'Bulut Sistemler']
  },
  {
    name: 'İşletme Dünyası',
    subCategories: ['Girişimcilik', 'Pazarlama', 'Proje Yönetimi', 'Ofis Programları']
  },
  { name: 'Kişisel Gelişim Dünyası', subCategories: [] },
  { name: 'Tasarım Dünyası', subCategories: [] },
  { name: 'K12 Dünyası', subCategories: [] },
  { 
    name: 'Kariyer Yolu', 
    subCategories: [
      'Bilgi Teknolojileri Giriş Programı', 'Yazılım Geliştirici', 'Web Geliştirici - Back-End', 
      'Web Geliştirici - Front End', 'Mobil Uygulama Geliştirici', 'Oyun Geliştirici', 
      'Veri Analisti', 'İş Zekası Uzmanı', 'Veri Bilimci', 'Makine Öğrenmesi Uzmanı', 
      'Veritabanı Yöneticisi', 'Büyük Veri Yönetim Uzmanı', 'Network Uzmanı', 
      'Sistem Yöneticisi', 'Veri Merkezi Uzmanı', 'Sızma Testi Uzmanı', 
      'Siber Güvenlik Uzmanı', 'Adli Bilişim Uzmanı', 'Zararlı Yazılım Uzmanı', 
      'İş Analisti', 'Yazılım Test Uzmanı', 'DevOps Uzmanı', 'Proje Yöneticisi', 
      'Bilgi Güvenliği Uzmanı', 'RPA Uzmanı', 'Blokzincir Uzmanı', 
      'CBS Yazılım Uzmanı', 'Gömülü Sistemler Uzmanı'
    ] 
  },
  { name: 'Güvenli İnternet', subCategories: [] },
  { name: 'Regülasyon Dünyası', subCategories: [] },
  { 
    name: 'Temel Bilimler', 
    subCategories: ['Matematik'] 
  },
  { name: 'Sosyal Bilimler', subCategories: [] },
  { 
    name: 'Kurum ve Kuruluşlar', 
    subCategories: [
      'Türk Patent ve Marka Kurumu', 'Karayolları Genel Müdürlüğü', 
      'MEB YEĞİTEK', 'ASBÜ'
    ] 
  }
];

const LEVELS = [
  { id: 'beginner', label: 'Temel Seviye', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { id: 'intermediate', label: 'Orta Seviye', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { id: 'advanced', label: 'İleri Seviye', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
];

export const Marketplace = () => {
  const navigate = useNavigate();
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [hideRegistered, setHideRegistered] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  
  // Accordion states
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isLevelOpen, setIsLevelOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({
    'Yazılım Dünyası': true,
    'Yapay Zekâ Dünyası': true,
    'Sistem Dünyası': true,
    'İşletme Dünyası': true
  });

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get('/courses/');
      return response.data;
    }
  });

  // Filter and Sort Logic
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    
    let result = [...courses];
    
    // Filtre: Arama
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q));
    }
    
    // Filtre: Kategoriler
    if (selectedCategories.length > 0) {
      result = result.filter(c => selectedCategories.includes(c.category));
    }
    
    // Filtre: Seviye
    if (selectedLevels.length > 0) {
      result = result.filter(c => selectedLevels.includes(c.level));
    }
    
    // Sıralama
    if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortOption === "popular") {
      result.sort((a, b) => (b.students || 0) - (a.students || 0));
    } else if (sortOption === "price_asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "price_desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    
    return result;
  }, [courses, searchQuery, selectedCategories, selectedLevels, sortOption, hideRegistered]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleLevel = (level) => {
    setSelectedLevels(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleCategoryExpand = (catName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const getLevelStyle = (level) => {
    const found = LEVELS.find(l => l.id === level);
    return found ? found.color : 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };
  
  const getLevelLabel = (level) => {
    const found = LEVELS.find(l => l.id === level);
    return found ? found.label : level || 'Tüm Seviyeler';
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pt-20 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <div className="text-sm text-slate-400 font-medium flex items-center gap-2">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/')}>Anasayfa</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-bold">Eğitimler</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row gap-8 mt-2">
        
        {/* SOL: Sidebar Menüsü */}
        <div className="w-full md:w-72 shrink-0 space-y-6">
          
          {/* Kayıtlı Eğitimleri Gösterme */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
            <span className="text-white text-sm font-semibold">Kayıtlı Eğitimleri Gösterme</span>
            <button 
              onClick={() => setHideRegistered(!hideRegistered)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${hideRegistered ? 'bg-primary' : 'bg-slate-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute transition-all ${hideRegistered ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>

          {/* Kategoriler */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-white font-bold">Kategoriler</span>
              <span className={`material-symbols-outlined text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {isCategoryOpen && (
              <div className="p-5 flex flex-col gap-1 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {CATEGORIES.map(cat => (
                  <div key={cat.name} className="flex flex-col mb-2">
                    <div className="flex items-center justify-between group">
                      <label className="flex items-center gap-3 cursor-pointer py-1" onClick={(e) => { e.preventDefault(); toggleCategory(cat.name); }}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat.name) ? 'bg-primary border-primary' : 'border-slate-500 group-hover:border-slate-400'}`}>
                          {selectedCategories.includes(cat.name) && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                        </div>
                        <span className={`text-sm transition-colors ${selectedCategories.includes(cat.name) ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-300'}`}>{cat.name}</span>
                      </label>
                      {cat.subCategories.length > 0 && (
                        <button 
                          onClick={() => toggleCategoryExpand(cat.name)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                        >
                          <span className={`material-symbols-outlined text-slate-400 text-[18px] transition-transform ${expandedCategories[cat.name] ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>
                      )}
                    </div>
                    
                    {/* Subcategories */}
                    {cat.subCategories.length > 0 && expandedCategories[cat.name] && (
                      <div className="flex flex-col gap-1.5 pl-8 mt-1 border-l border-white/5 ml-2.5">
                        {cat.subCategories.map(subCat => (
                          <label key={subCat} className="flex items-center gap-3 cursor-pointer group py-1" onClick={(e) => { e.preventDefault(); toggleCategory(subCat); }}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(subCat) ? 'bg-primary border-primary' : 'border-slate-600 group-hover:border-slate-400'}`}>
                              {selectedCategories.includes(subCat) && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
                            </div>
                            <span className={`text-xs transition-colors ${selectedCategories.includes(subCat) ? 'text-white font-medium' : 'text-slate-500 group-hover:text-slate-300'}`}>{subCat}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Eğitim Seviyesi */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setIsLevelOpen(!isLevelOpen)}
              className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-white font-bold">Eğitim Seviyesi</span>
              <span className={`material-symbols-outlined text-slate-400 transition-transform ${isLevelOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {isLevelOpen && (
              <div className="p-5 flex flex-col gap-3">
                {LEVELS.map(level => (
                  <label key={level.id} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleLevel(level.id); }}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedLevels.includes(level.id) ? 'bg-primary border-primary' : 'border-slate-500 group-hover:border-slate-400'}`}>
                      {selectedLevels.includes(level.id) && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                    </div>
                    <span className={`text-sm transition-colors ${selectedLevels.includes(level.id) ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-300'}`}>{level.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SAĞ: Ana İçerik */}
        <div className="flex-1 space-y-6">
          
          {/* Üst Bar: Başlık, Arama, Sıralama */}
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white">Eğitimler</h1>
              <p className="text-sm text-slate-400 mt-1"><span className="text-primary font-bold">{filteredCourses.length}</span> Eğitim Bulundu</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input 
                  type="text" 
                  placeholder="Arama yap..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-slate-500"
                />
              </div>
              
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full sm:w-48 bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="newest">En Yeni</option>
                <option value="popular">En Popüler</option>
                <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
              </select>
            </div>
          </div>

          {/* Kurs Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error && !courses ? (
            <div className="text-error bg-error/10 p-6 rounded-2xl border border-error/20 font-bold">Eğitimler yüklenirken bir sorun oluştu.</div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">search_off</span>
              <p className="text-lg font-medium">Arama kriterlerinize uygun eğitim bulunamadı.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategories([]); setSelectedLevels([]); }}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course, idx) => (
                <div 
                  key={course.id} 
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group flex flex-col h-full animate-fade-in-up"
                  style={{ animationDelay: `${(idx % 10) * 0.05}s` }}
                >
                  {/* Kapak Görseli */}
                  <div className={`h-40 w-full relative overflow-hidden ${course.thumbnail_url ? '' : 'bg-gradient-to-br from-slate-700 to-slate-800'}`}>
                    {course.thumbnail_url && (
                      <img src={course.thumbnail_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${course.thumbnail_url}` : course.thumbnail_url} alt="Kapak" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                      {course.category}
                    </div>
                  </div>

                  {/* Kart İçeriği */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-white leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <div className="mt-auto">
                      {/* Seviye Badge */}
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded border text-[11px] font-bold uppercase tracking-wider ${getLevelStyle(course.level)}`}>
                          {getLevelLabel(course.level)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 text-slate-400 text-sm">
                        <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[16px] text-slate-500">thumb_up</span>
                          <span className="font-semibold">{course.reviews?.length > 0 ? (course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length).toFixed(1) * 10 : 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[16px] text-slate-500">group</span>
                          <span className="font-semibold">{course.students || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
