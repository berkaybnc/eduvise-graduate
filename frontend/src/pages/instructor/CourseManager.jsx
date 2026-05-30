import { useState } from 'react';

const MOCK_COURSES = [
  { id: 1, title: 'İleri Düzey Python', category: 'Yazılım', students: 124, rating: 4.9, status: 'Yayında', gradient: 'from-blue-600 to-indigo-900', sections: 12, videos: 45 },
  { id: 2, title: 'Siber Güvenliğe Giriş', category: 'Siber Güvenlik', students: 342, rating: 4.8, status: 'Yayında', gradient: 'from-emerald-600 to-teal-900', sections: 8, videos: 32 },
  { id: 3, title: 'Web Geliştirme Bootcamp', category: 'Yazılım', students: 89, rating: 4.7, status: 'Taslak', gradient: 'from-orange-600 to-red-900', sections: 15, videos: 62 },
];

const CourseManager = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 pb-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-black tracking-tight">Kurs & İçerik Yöneticisi</h1>
            <p className="text-slate-400 text-sm mt-1">Kurslarınızı yönetin, yeni içerikler ekleyin.</p>
          </div>
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Yeni Kurs Oluştur
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1E293B] p-1 rounded-xl border border-white/10 w-fit">
          {[
            { id: 'courses', label: 'Kurslarım', icon: 'video_library' },
            { id: 'upload', label: 'İçerik Ekle', icon: 'cloud_upload' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_COURSES.map((course) => (
              <div key={course.id} className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group cursor-pointer">
                <div className={`h-36 bg-gradient-to-br ${course.gradient} relative`}>
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      course.status === 'Yayında'
                        ? 'bg-emerald-500/80 text-white'
                        : 'bg-yellow-500/80 text-white'
                    }`}>{course.status}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-white/70 text-xs font-medium">{course.category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-base mb-3 group-hover:text-primary transition-colors">{course.title}</h3>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-white/5 rounded-xl">
                      <p className="text-white font-bold text-sm">{course.sections}</p>
                      <p className="text-slate-500 text-[10px]">Bölüm</p>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded-xl">
                      <p className="text-white font-bold text-sm">{course.videos}</p>
                      <p className="text-slate-500 text-[10px]">Video</p>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded-xl">
                      <p className="text-emerald-400 font-bold text-sm">{course.students}</p>
                      <p className="text-slate-500 text-[10px]">Öğrenci</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-yellow-400 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-white text-sm font-bold">{course.rating}</span>
                    </div>
                    <button
                      onClick={() => { setActiveTab('upload'); }}
                      className="flex items-center gap-1 text-primary text-xs font-bold hover:text-indigo-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      Düzenle
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Course Placeholder */}
            <button
              onClick={() => setActiveTab('upload')}
              className="bg-[#1E293B] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-2xl transition-colors">add</span>
              </div>
              <p className="text-slate-400 group-hover:text-white text-sm font-semibold transition-colors">Yeni Kurs Ekle</p>
            </button>
          </div>
        )}

        {/* Upload / Create Tab */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl">
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">cloud_upload</span>
                Yeni İçerik Ekle
              </h2>
              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-1.5">Kurs Başlığı</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="Örn: İleri Düzey Python Programlama"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-1.5">Kategori</label>
                  <select className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all">
                    <option className="bg-[#1E293B]" value="">Kategori Seçin</option>
                    <option className="bg-[#1E293B]">Yazılım</option>
                    <option className="bg-[#1E293B]">Siber Güvenlik</option>
                    <option className="bg-[#1E293B]">Veri Bilimi</option>
                    <option className="bg-[#1E293B]">Yapay Zeka</option>
                    <option className="bg-[#1E293B]">Tasarım</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-1.5">Hangi Kursa Eklenecek?</label>
                  <select className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all">
                    <option className="bg-[#1E293B]">Yeni Kurs</option>
                    {MOCK_COURSES.map(c => (
                      <option key={c.id} className="bg-[#1E293B]">{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-1.5">Bölüm Adı</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="Örn: Değişkenler ve Veri Tipleri"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-1.5">Video Dosyası veya URL</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-3xl transition-colors">cloud_upload</span>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-300 font-semibold text-sm">Videoyu buraya sürükleyin</p>
                      <p className="text-slate-500 text-xs mt-1">veya tıklayarak seçin • MP4, MOV, AVI</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-1.5">Ders Notları (Opsiyonel)</label>
                  <div className="border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:border-primary/40 transition-all cursor-pointer bg-white/5">
                    <span className="material-symbols-outlined text-slate-400">attach_file</span>
                    <span className="text-slate-500 text-sm">PDF veya ZIP dosyası seçin...</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('courses')}
                    className="flex-1 py-3 rounded-xl text-slate-400 hover:text-white border border-white/10 hover:border-white/20 font-semibold transition-all"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                  >
                    İçeriği Yükle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseManager;
