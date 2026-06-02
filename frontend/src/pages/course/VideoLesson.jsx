import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import CertificateGenerator from '../../components/CertificateGenerator';
import CourseForum from '../../components/course/CourseForum';
import useAuthStore from '../../store/authStore';

export const Learn = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [openSections, setOpenSections] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    }
  });

  const { data: enrolledCourses = [], refetch: refetchEnrolled } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: async () => {
      const res = await api.get('/courses/enrolled');
      return res.data;
    }
  });

  const enrollment = enrolledCourses.find(e => e.course.id === courseId);
  const completedVideos = enrollment?.completed_videos || [];
  
  const totalVideos = course?.sections?.reduce((acc, s) => acc + (s.videos?.length || 0), 0) || 0;
  const progress = totalVideos === 0 ? 0 : Math.round((completedVideos.length / totalVideos) * 100);

  const { data: examStatus } = useQuery({
    queryKey: ['finalExamStatus', courseId],
    queryFn: async () => {
      const res = await api.get(`/assessments/${courseId}/final/status`);
      return res.data;
    },
    enabled: !!courseId && progress === 100
  });

  if (isLoading) return (
    <div className="min-h-screen bg-[#0F172A] flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!course) return (
    <div className="min-h-screen bg-[#0F172A] flex justify-center items-center">
      <div className="text-error bg-error/10 p-6 rounded-2xl border border-error/20 font-bold">Kurs bulunamadı!</div>
    </div>
  );

  let currentVideo = null;
  let currentSectionIndex = 0;
  for (let i = 0; i < course.sections.length; i++) {
    for (const video of course.sections[i].videos) {
      if (video.id === lessonId) {
        currentVideo = video;
        currentSectionIndex = i;
        break;
      }
    }
    if (currentVideo) break;
  }
  if (!currentVideo && course.sections?.[0]?.videos?.[0]) {
    currentVideo = course.sections[0].videos[0];
  }

  const handleComplete = async () => {
    if (!currentVideo) return;
    try {
      const res = await api.put(`/courses/videos/${currentVideo.id}/complete?course_id=${courseId}`);
      if (res.data.awarded_badges && res.data.awarded_badges.length > 0) {
        // refetch user data to update badges in UI
        const userRes = await api.get('/auth/me');
        useAuthStore.getState().setUser(userRes.data);
        alert(`Tebrikler! Yeni bir rozet kazandınız: ${res.data.awarded_badges[0].name}`);
      }
      await refetchEnrolled();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { role: 'user', content: inputText.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/chat', {
        message: userMessage.content,
        course_title: course?.title,
        video_title: currentVideo?.title
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: prev[id] === undefined ? false : !prev[id] }));
  };

  const handleIssueCertificate = async () => {
    try {
      const res = await api.post(`/courses/${courseId}/certificate/issue`);
      setCertificateData({
        courseTitle: course.title,
        instructorName: course.instructor?.full_name || 'Eğitmen',
        certificateCode: res.data.certificate_code,
        issuedAt: res.data.issued_at || new Date().toISOString()
      });
      setShowCertificate(true);
    } catch (err) {
      alert(err.response?.data?.detail || 'Sertifika oluşturulurken bir hata oluştu.');
    }
  };

  const isCompleted = completedVideos.includes(currentVideo?.id);

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8 flex flex-col xl:flex-row gap-8">
        
        {/* Left Column: Main Learning Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-3xl overflow-hidden relative shadow-2xl shadow-black/50 border border-white/10">
            {currentVideo ? (
              <video 
                key={currentVideo.id}
                controls
                autoPlay
                className="w-full h-full object-contain"
                src={currentVideo.video_url.startsWith('/uploads') ? `http://localhost:8000${currentVideo.video_url}` : currentVideo.video_url}
                onEnded={handleComplete}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">Video bulunamadı</div>
            )}
          </div>
          
          {/* Lesson Info */}
          <div className="mt-8 bg-[#1E293B] border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-lg text-xs font-bold text-primary uppercase tracking-wider">
                Bölüm {currentSectionIndex + 1}
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs font-bold text-emerald-400">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Tamamlandı
                </span>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-white mb-4 leading-tight">{currentVideo?.title}</h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                  {currentVideo?.description || 'Bu video için açıklama bulunmuyor.'}
                </p>
              </div>
              
              <button 
                onClick={handleComplete}
                className={`shrink-0 px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isCompleted
                    ? 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isCompleted ? 'replay' : 'task_alt'}
                </span>
                {isCompleted ? 'Tekrar İşaretle' : 'Dersi Tamamla'}
              </button>
            </div>
            
            {progress === 100 && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                    <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                  </div>
                  <div>
                    <h4 className="text-emerald-400 font-bold">
                      {examStatus?.has_passed ? "Tebrikler! Sertifikanızı kazandınız." : "Tebrikler! Kursu tamamladınız."}
                    </h4>
                    <p className="text-emerald-500/80 text-sm">
                      {examStatus?.has_passed 
                        ? "Başarı sertifikanızı şimdi alabilirsiniz." 
                        : "Sertifika alabilmek için bitirme sınavını başarıyla geçmelisiniz."}
                    </p>
                  </div>
                </div>
                {examStatus?.has_passed ? (
                  <button onClick={handleIssueCertificate} className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 whitespace-nowrap">
                    Sertifikayı İndir
                  </button>
                ) : (
                  <button onClick={() => navigate(`/courses/${courseId}/exam`)} className="px-6 py-2 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap">
                    Sınava Gir
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Attachments */}
          {currentVideo?.attachments && currentVideo.attachments.length > 0 && (
            <div className="mt-6 bg-[#1E293B] border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">folder_open</span>
                Ders Kaynakları & Dökümanlar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentVideo.attachments.map(attachment => (
                  <a 
                    key={attachment.id} 
                    href={attachment.file_url.startsWith('/uploads') ? `http://localhost:8000${attachment.file_url}` : attachment.file_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary">description</span>
                      </div>
                      <span className="font-semibold text-sm text-slate-300 group-hover:text-white truncate">
                        {attachment.file_name || 'Ders Notu'}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors shrink-0">download</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* AI Assistant Banner */}
          <div className="mt-6 relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
              <span className="material-symbols-outlined text-white text-3xl">smart_toy</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-xl font-bold text-white mb-2">Yapay Zeka Öğrenme Asistanı</h4>
              <p className="text-indigo-200 text-sm leading-relaxed">
                Bu konu ile ilgili detaylı pratik yapmak ister misiniz? Öğrendiklerinizi pekiştirmek için size özel sorular oluşturabilir veya anlamadığınız noktaları detaylandırabilirim.
              </p>
            </div>
            <button onClick={() => setChatOpen(true)} className="shrink-0 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/20 backdrop-blur-md">
              Pratik Yap
            </button>
          </div>

          {/* Community Forum */}
          <div className="mt-8">
            <CourseForum courseId={courseId} />
          </div>

        </div>
        
        {/* Right Column: Course Content Sidebar */}
        <aside className="w-full xl:w-[400px] shrink-0">
          <div className="bg-[#1E293B] border border-white/10 rounded-3xl flex flex-col h-[calc(100vh-8rem)] sticky top-24 overflow-hidden shadow-2xl">
            
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/10 bg-black/20">
              <h3 className="text-xl font-black text-white mb-4">Müfredat</h3>
              <div className="flex items-center gap-4">
                <div className="h-3 flex-1 bg-white/10 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all rounded-full relative" style={{ width: `${progress}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-400">%{progress}</span>
              </div>
            </div>
            
            {/* Sections */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {course.sections.map((section, idx) => {
                const isOpen = openSections[section.id] !== false; // default open
                return (
                  <div key={section.id} className="border-b border-white/5 last:border-0">
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Bölüm {idx + 1}</span>
                        <span className="text-base font-bold text-white leading-tight">{section.title}</span>
                      </div>
                      <span className={`material-symbols-outlined text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    
                    {isOpen && (
                      <div className="px-3 pb-4 space-y-1">
                        {section.videos.map((video, vIdx) => {
                          const isVidCompleted = completedVideos.includes(video.id);
                          const isCurrent = currentVideo?.id === video.id;
                          return (
                            <div 
                              key={video.id} 
                              onClick={() => navigate(`/learn/${courseId}/${video.id}`)}
                              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                                isCurrent 
                                  ? 'bg-primary/20 border border-primary/30 shadow-lg shadow-primary/5' 
                                  : 'hover:bg-white/5 border border-transparent'
                              }`}
                            >
                              <span className={`material-symbols-outlined mt-0.5 text-[20px] shrink-0 transition-colors ${
                                isVidCompleted 
                                  ? 'text-emerald-400' 
                                  : isCurrent ? 'text-primary' : 'text-slate-500 group-hover:text-white'
                              }`} style={{fontVariationSettings: "'FILL' 1"}}>
                                {isVidCompleted ? 'check_circle' : isCurrent ? 'play_circle' : 'play_circle'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm leading-snug truncate ${isCurrent ? 'text-white font-bold' : 'text-slate-300 font-medium'}`}>
                                  {idx + 1}.{vIdx + 1} {video.title}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5">
                                  {video.duration_seconds > 0 && (
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                                      {Math.floor(video.duration_seconds / 60)} dk
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
          </div>
        </aside>
      </div>

      {/* AI Chat Drawer */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setChatOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#0F172A] border-l border-white/10 shadow-2xl flex flex-col h-full transform transition-transform duration-300">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <span className="material-symbols-outlined text-white">smart_toy</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">AI Öğrenme Asistanı</h3>
                  <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Çevrimiçi
                  </p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-indigo-400 text-3xl">waving_hand</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">Merhaba!</h4>
                  <p className="text-slate-400 text-sm max-w-[250px] mx-auto">
                    '{currentVideo?.title}' konusuyla ilgili bana her şeyi sorabilirsiniz.
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-primary to-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-[#1E293B] text-slate-300 border border-white/5 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1E293B] border border-white/5 rounded-2xl rounded-tl-sm p-4 flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1E293B] border-t border-white/10">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim() || isTyping}
                  className="absolute right-2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCertificate && certificateData && (
        <CertificateGenerator
          courseTitle={certificateData.courseTitle}
          instructorName={certificateData.instructorName}
          certificateCode={certificateData.certificateCode}
          issuedAt={certificateData.issuedAt}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};

export default Learn;
