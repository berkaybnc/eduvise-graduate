import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../lib/api';
import FileUploadZone from '../../components/FileUploadZone';

const CATEGORIES = ['Yazılım', 'Siber Güvenlik', 'Veri Bilimi', 'Yapay Zeka', 'Tasarım', 'İş Dünyası', 'Matematik', 'Diğer'];
const LEVELS = [
  { value: 'beginner', label: 'Başlangıç' },
  { value: 'intermediate', label: 'Orta Düzey' },
  { value: 'advanced', label: 'İleri Düzey' },
];

// ─── Adım göstergesi ────────────────────────────────────────────────────────
const StepIndicator = ({ step }) => {
  const steps = ['Kurs Bilgileri', 'Bölümler & Videolar', 'Yayınla'];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all
            ${step > i ? 'bg-emerald-500 text-white' : step === i ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-white/5 text-slate-500'}`}>
            {step > i ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
          </div>
          <span className={`text-sm font-semibold hidden sm:block ${step === i ? 'text-white' : step > i ? 'text-emerald-400' : 'text-slate-500'}`}>
            {label}
          </span>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px w-8 mx-1 ${step > i ? 'bg-emerald-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
};


// ─── Ana Bileşen ─────────────────────────────────────────────────────────────
const CourseManager = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.openCreateTab ? 'create' : 'courses');
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Kurs oluşturma state
  const [step, setStep] = useState(0);
  const [courseInfo, setCourseInfo] = useState({ title: '', description: '', category: '', level: 'beginner', price: 0, thumbnail_url: '' });
  const [createdCourse, setCreatedCourse] = useState(null);
  const [sections, setSections] = useState([]);  // [{id, title, videos:[{id,title,video_url,doc_url,doc_name}]}]
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);
  const [publishingCourse, setPublishingCourse] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Video ekleme/düzenleme state (hangi section için)
  const [addingVideoFor, setAddingVideoFor] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoForm, setVideoForm] = useState({ title: '', video_url: '', is_preview: false });
  const [pendingDocUrl, setPendingDocUrl] = useState('');
  const [pendingDocName, setPendingDocName] = useState('');

  const loadCourses = () => setRefreshKey(k => k + 1);

  useEffect(() => {
    let cancelled = false;
    api.get('/instructor/courses')
      .then(res => { if (!cancelled) { setCourses(res.data); setLoadingCourses(false); } })
      .catch(() => { if (!cancelled) { setCourses([]); setLoadingCourses(false); } });
    return () => { cancelled = true; };
  }, [refreshKey]);


  const resetCreation = () => {
    setStep(0);
    setCourseInfo({ title: '', description: '', category: '', level: 'beginner', price: 0, thumbnail_url: '' });
    setCreatedCourse(null);
    setSections([]);
    setNewSectionTitle('');
    setErrorMsg('');
    setAddingVideoFor(null);
    setEditingVideoId(null);
  };

  const handleEditCourse = (course) => {
    setCreatedCourse(course);
    setCourseInfo({
      title: course.title,
      description: course.description || '',
      category: course.category,
      level: course.level || 'beginner',
      price: course.price || 0,
      thumbnail_url: course.thumbnail_url || ''
    });
    setSections(course.sections || []);
    setStep(1);
    setActiveTab('create');
  };

  // Adım 1 → Kurs oluştur veya güncelle
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseInfo.title || !courseInfo.category) { setErrorMsg('Lütfen zorunlu alanları doldurun.'); return; }
    setSavingCourse(true); setErrorMsg('');
    try {
      if (createdCourse) {
        const res = await api.put(`/courses/${createdCourse.id}`, courseInfo);
        setCreatedCourse(res.data);
      } else {
        const res = await api.post('/courses/', { ...courseInfo, tags: [], topic_map: {} });
        setCreatedCourse(res.data);
      }
      setStep(1);
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || 'Kurs kaydedilemedi.');
    } finally {
      setSavingCourse(false);
    }
  };

  // Bölüm ekle
  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    try {
      const res = await api.post(`/courses/${createdCourse.id}/sections`, {
        title: newSectionTitle.trim(), order_index: sections.length,
      });
      setSections(prev => [...prev, { ...res.data, videos: [] }]);
      setNewSectionTitle('');
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || 'Bölüm eklenemedi.');
    }
  };

  // Video kaydet / güncelle
  const handleSaveVideo = async () => {
    if (!videoForm.title || !videoForm.video_url) { setErrorMsg('Video başlığı ve dosyası/URL zorunludur.'); return; }
    try {
      if (editingVideoId) {
        const res = await api.put(`/courses/videos/${editingVideoId}`, {
          title: videoForm.title,
          video_url: videoForm.video_url,
          is_preview: videoForm.is_preview,
        });
        setSections(prev => prev.map(s =>
          s.id === addingVideoFor
            ? { ...s, videos: s.videos.map(v => v.id === editingVideoId ? { ...v, ...res.data } : v) }
            : s
        ));
      } else {
        const res = await api.post(`/courses/sections/${addingVideoFor}/videos`, {
          title: videoForm.title,
          video_url: videoForm.video_url,
          duration_seconds: 0,
          order_index: 0,
          is_preview: videoForm.is_preview,
        });
        setSections(prev => prev.map(s =>
          s.id === addingVideoFor
            ? { ...s, videos: [...s.videos, { ...res.data, doc_url: pendingDocUrl, doc_name: pendingDocName }] }
            : s
        ));
      }
      setAddingVideoFor(null);
      setEditingVideoId(null);
      setVideoForm({ title: '', video_url: '', is_preview: false });
      setPendingDocUrl(''); setPendingDocName('');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || 'Video kaydedilemedi.');
    }
  };

  const handleEditVideo = (sectionId, video) => {
    setAddingVideoFor(sectionId);
    setEditingVideoId(video.id);
    setVideoForm({ title: video.title, video_url: video.video_url, is_preview: video.is_preview });
  };

  const handleDeleteVideo = async (sectionId, videoId) => {
    if (!window.confirm('Videoyu silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/courses/videos/${videoId}`);
      setSections(prev => prev.map(s => 
        s.id === sectionId ? { ...s, videos: s.videos.filter(v => v.id !== videoId) } : s
      ));
    } catch (err) {
      alert(err?.response?.data?.detail || 'Video silinemedi.');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Bölümü ve içindeki tüm videoları silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/courses/sections/${sectionId}`);
      setSections(prev => prev.filter(s => s.id !== sectionId));
    } catch (err) {
      alert(err?.response?.data?.detail || 'Bölüm silinemedi.');
    }
  };

  // Yayınla
  const handlePublish = async () => {
    setPublishingCourse(true);
    try {
      await api.put(`/courses/${createdCourse.id}`, { is_published: true });
      await loadCourses();
      setActiveTab('courses');
      resetCreation();
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || 'Yayınlama başarısız.');
    } finally {
      setPublishingCourse(false);
    }
  };

  // Kursu sil
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Bu kursu silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      alert(err?.response?.data?.detail || 'Kurs silinemedi.');
    }
  };

  const GRADIENT_MAP = {
    Yazılım: 'from-blue-600 to-indigo-900',
    'Siber Güvenlik': 'from-emerald-600 to-teal-900',
    'Veri Bilimi': 'from-orange-600 to-red-900',
    'Yapay Zeka': 'from-purple-600 to-violet-900',
    Tasarım: 'from-pink-600 to-rose-900',
    default: 'from-slate-600 to-slate-900',
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 pb-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-black tracking-tight">Kurs & İçerik Yöneticisi</h1>
            <p className="text-slate-400 text-sm mt-1">Kurslarınızı yönetin, yeni içerikler ekleyin.</p>
          </div>
          {activeTab === 'courses' && (
            <button
              onClick={() => { resetCreation(); setActiveTab('create'); }}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Yeni Kurs Oluştur
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1E293B] p-1 rounded-xl border border-white/10 w-fit">
          {[
            { id: 'courses', label: 'Kurslarım', icon: 'video_library' },
            { id: 'create', label: 'Yeni Kurs', icon: 'add_circle' },
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

        {/* ──────────────── KURSLARIM ──────────────── */}
        {activeTab === 'courses' && (
          <div>
            {loadingCourses ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-500 text-4xl">video_library</span>
                </div>
                <p className="text-slate-400 font-semibold">Henüz hiç kursunuz yok.</p>
                <button onClick={() => setActiveTab('create')}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition-all">
                  İlk Kursumu Oluştur
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map(course => (
                  <div key={course.id} className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group">
                    <div className={`h-36 relative ${course.thumbnail_url ? '' : `bg-gradient-to-br ${GRADIENT_MAP[course.category] || GRADIENT_MAP.default}`}`}>
                      {course.thumbnail_url && (
                        <img src={course.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${course.thumbnail_url}` : course.thumbnail_url} alt="Kapak" className="absolute inset-0 w-full h-full object-cover" />
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                          course.is_published ? 'bg-emerald-500/80 text-white backdrop-blur-md' : 'bg-yellow-500/80 text-white backdrop-blur-md'
                        }`}>
                          {course.is_published ? 'Yayında' : 'Taslak'}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <span className="text-white/90 text-xs font-bold">{course.category}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold text-base mb-3 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 bg-white/5 rounded-xl">
                          <p className="text-white font-bold text-sm">{course.sections?.length || 0}</p>
                          <p className="text-slate-500 text-[10px]">Bölüm</p>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded-xl">
                          <p className="text-white font-bold text-sm">
                            {course.sections?.reduce((acc, s) => acc + (s.videos?.length || 0), 0) || 0}
                          </p>
                          <p className="text-slate-500 text-[10px]">Video</p>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded-xl">
                          <p className="text-white font-bold text-sm">{course.price === 0 ? 'Ücretsiz' : `₺${course.price}`}</p>
                          <p className="text-slate-500 text-[10px]">Fiyat</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-slate-500 text-xs">{LEVELS.find(l => l.value === course.level)?.label || course.level}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="flex items-center gap-1 text-emerald-400 text-xs font-bold hover:text-emerald-300 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="flex items-center gap-1 text-red-400 text-xs font-bold hover:text-red-300 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Yeni kurs kartı */}
                <button
                  onClick={() => { resetCreation(); setActiveTab('create'); }}
                  className="bg-[#1E293B] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-2xl transition-colors">add</span>
                  </div>
                  <p className="text-slate-400 group-hover:text-white text-sm font-semibold transition-colors">Yeni Kurs Ekle</p>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ──────────────── KURS OLUŞTUR ──────────────── */}
        {activeTab === 'create' && (
          <div className="max-w-2xl">
            <StepIndicator step={step} />

            {errorMsg && (
              <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">error</span>
                <span className="text-sm font-medium">{errorMsg}</span>
              </div>
            )}

            {/* ── Adım 0: Kurs Bilgileri ── */}
            {step === 0 && (
              <form onSubmit={handleCreateCourse} className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 space-y-5">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                  Kurs Bilgilerini Girin
                </h2>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-1.5">Kurs Başlığı *</label>
                  <input
                    type="text" value={courseInfo.title} required
                    onChange={e => setCourseInfo(p => ({ ...p, title: e.target.value }))}
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Örn: İleri Düzey Python Programlama"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-1.5">Açıklama</label>
                  <textarea
                    rows={3} value={courseInfo.description}
                    onChange={e => setCourseInfo(p => ({ ...p, description: e.target.value }))}
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-all resize-none"
                    placeholder="Kurs hakkında kısa bir açıklama yazın..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-1.5">Kapak Fotoğrafı</label>
                  {courseInfo.thumbnail_url ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 h-48">
                      <img src={courseInfo.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${courseInfo.thumbnail_url}` : courseInfo.thumbnail_url} alt="Kapak" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setCourseInfo(p => ({ ...p, thumbnail_url: '' }))} className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-lg hover:bg-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  ) : (
                    <FileUploadZone
                      accept="image/*"
                      label="Kapak fotoğrafı yükleyin veya sürükleyin"
                      icon="image"
                      hint="JPG, PNG, WEBP (Maks 5MB)"
                      onUploaded={(url) => setCourseInfo(p => ({ ...p, thumbnail_url: url }))}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-1.5">Kategori *</label>
                    <select
                      value={courseInfo.category} required
                      onChange={e => setCourseInfo(p => ({ ...p, category: e.target.value }))}
                      className="w-full p-3 bg-[#0F172A] rounded-xl border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                    >
                      <option value="">Seçin</option>
                      {CATEGORIES.map(c => <option key={c} className="bg-[#0F172A]">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-1.5">Seviye</label>
                    <select
                      value={courseInfo.level}
                      onChange={e => setCourseInfo(p => ({ ...p, level: e.target.value }))}
                      className="w-full p-3 bg-[#0F172A] rounded-xl border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                    >
                      {LEVELS.map(l => <option key={l.value} value={l.value} className="bg-[#0F172A]">{l.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-1.5">Fiyat (₺) — 0 = Ücretsiz</label>
                  <input
                    type="number" min={0} step={0.01} value={courseInfo.price}
                    onChange={e => setCourseInfo(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="0"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setActiveTab('courses')}
                    className="flex-1 py-3 rounded-xl text-slate-400 hover:text-white border border-white/10 hover:border-white/20 font-semibold transition-all">
                    İptal
                  </button>
                  <button type="submit" disabled={savingCourse}
                    className="flex-1 bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                    {savingCourse ? <><span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> Oluşturuluyor...</> : 'Kursu Oluştur ve Devam Et →'}
                  </button>
                </div>
              </form>
            )}

            {/* ── Adım 1: Bölümler & Videolar ── */}
            {step === 1 && createdCourse && (
              <div className="space-y-5">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                  <div>
                    <p className="text-emerald-400 font-bold text-sm">Kurs Oluşturuldu!</p>
                    <p className="text-slate-400 text-xs">"{createdCourse.title}" — Şimdi bölüm ve videolar ekleyin.</p>
                  </div>
                </div>

                {/* Bölümler listesi */}
                {sections.map((section, si) => (
                  <div key={section.id} className="bg-[#1E293B] border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4 group/section">
                      <h3 className="text-white font-bold flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary/20 text-primary rounded-lg text-xs font-black flex items-center justify-center">{si + 1}</span>
                        {section.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-xs">{section.videos.length} video</span>
                        <button type="button" onClick={() => handleDeleteSection(section.id)} className="opacity-0 group-hover/section:opacity-100 text-red-400 hover:text-red-300 transition-all">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {section.videos.map((v) => (
                      <div key={v.id} className="group/video flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-2 hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-primary text-sm">play_circle</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{v.title}</p>
                          {v.doc_name && <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-[12px]">attach_file</span>{v.doc_name}</p>}
                        </div>
                        {v.is_preview && <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md">Önizleme</span>}
                        <div className="opacity-0 group-hover/video:opacity-100 flex items-center gap-2 transition-all">
                          <button type="button" onClick={() => handleEditVideo(section.id, v)} className="text-emerald-400 hover:text-emerald-300">
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button type="button" onClick={() => handleDeleteVideo(section.id, v.id)} className="text-red-400 hover:text-red-300">
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {addingVideoFor === section.id ? (
                      <div className="mt-3 p-4 bg-white/5 rounded-xl space-y-3 border border-white/10">
                        <p className="text-white text-sm font-bold">{editingVideoId ? 'Videoyu Düzenle' : 'Video Ekle'}</p>
                        <input
                          type="text" placeholder="Video başlığı *" value={videoForm.title}
                          onChange={e => setVideoForm(p => ({ ...p, title: e.target.value }))}
                          className="w-full p-2.5 bg-white/5 rounded-lg border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary/50"
                        />
                        <FileUploadZone
                          accept="video/*"
                          label="Video dosyasını yükleyin"
                          icon="videocam"
                          hint="MP4, MOV, AVI, MKV, WEBM"
                          onUploaded={(url) => setVideoForm(p => ({ ...p, video_url: url }))}
                        />
                        {!videoForm.video_url && (
                          <div>
                            <p className="text-slate-500 text-xs mb-1 text-center">— veya URL girin —</p>
                            <input
                              type="url" placeholder="https://... (YouTube, vimeo, vs.)" value={videoForm.video_url}
                              onChange={e => setVideoForm(p => ({ ...p, video_url: e.target.value }))}
                              className="w-full p-2.5 bg-white/5 rounded-lg border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary/50"
                            />
                          </div>
                        )}
                        <FileUploadZone
                          accept=".pdf,.zip,.docx,.pptx,.xlsx"
                          label="Ders notu / döküman (opsiyonel)"
                          icon="attach_file"
                          hint="PDF, ZIP, DOCX, PPTX"
                          onUploaded={(url, name) => { setPendingDocUrl(url); setPendingDocName(name); }}
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={videoForm.is_preview} onChange={e => setVideoForm(p => ({ ...p, is_preview: e.target.checked }))}
                            className="w-4 h-4 accent-primary" />
                          <span className="text-slate-300 text-sm">Bu videoyu ücretsiz önizleme yap</span>
                        </label>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { setAddingVideoFor(null); setEditingVideoId(null); setVideoForm({ title: '', video_url: '', is_preview: false }); setErrorMsg(''); }}
                            className="flex-1 py-2 rounded-lg text-slate-400 hover:text-white border border-white/10 text-sm font-semibold transition-all">İptal</button>
                          <button type="button" onClick={handleSaveVideo}
                            className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-indigo-600 transition-all">{editingVideoId ? 'Güncelle' : 'Kaydet'}</button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => { setAddingVideoFor(section.id); setErrorMsg(''); }}
                        className="mt-3 w-full py-2 border border-dashed border-white/10 rounded-xl text-slate-500 hover:text-primary hover:border-primary/30 text-sm font-semibold transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Video Ekle
                      </button>
                    )}
                  </div>
                ))}

                {/* Yeni bölüm ekle */}
                <div className="bg-[#1E293B] border border-dashed border-white/10 rounded-2xl p-5">
                  <p className="text-slate-300 text-sm font-semibold mb-3">Yeni Bölüm Ekle</p>
                  <div className="flex gap-3">
                    <input
                      type="text" placeholder="Bölüm adı (örn: Giriş)" value={newSectionTitle}
                      onChange={e => setNewSectionTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSection(); } }}
                      className="flex-1 p-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-all"
                    />
                    <button type="button" onClick={handleAddSection}
                      className="px-5 bg-primary text-white rounded-xl font-bold hover:bg-indigo-600 transition-all active:scale-95">
                      Ekle
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} disabled={sections.length === 0}
                    className="flex-1 bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2">
                    İleri: Yayınla →
                  </button>
                </div>
              </div>
            )}

            {/* ── Adım 2: Yayınla ── */}
            {step === 2 && createdCourse && (
              <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 space-y-6">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">rocket_launch</span>
                  Kursu Yayınla
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-slate-400 text-sm">Kurs Adı</span>
                    <span className="text-white text-sm font-semibold">{createdCourse.title}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-slate-400 text-sm">Kategori</span>
                    <span className="text-white text-sm font-semibold">{createdCourse.category}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-slate-400 text-sm">Seviye</span>
                    <span className="text-white text-sm font-semibold">{LEVELS.find(l => l.value === createdCourse.level)?.label}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-slate-400 text-sm">Toplam Bölüm</span>
                    <span className="text-white text-sm font-semibold">{sections.length}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-400 text-sm">Toplam Video</span>
                    <span className="text-white text-sm font-semibold">{sections.reduce((a, s) => a + s.videos.length, 0)}</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-400 mt-0.5">info</span>
                  <p className="text-amber-200 text-sm">Yayınlandıktan sonra kurs markette görünür olacak. İstediğiniz zaman taslağa döndürebilirsiniz.</p>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl text-slate-400 hover:text-white border border-white/10 font-semibold transition-all">
                    ← Geri
                  </button>
                  <button type="button" onClick={handlePublish} disabled={publishingCourse}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                    {publishingCourse ? <><span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> Yayınlanıyor...</> : <><span className="material-symbols-outlined text-xl">rocket_launch</span> Kursu Yayınla</>}
                  </button>
                </div>
                <button type="button" onClick={() => { setActiveTab('courses'); resetCreation(); }}
                  className="w-full text-slate-500 hover:text-slate-300 text-sm font-semibold transition-colors">
                  Taslak olarak kaydet ve çık
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManager;
