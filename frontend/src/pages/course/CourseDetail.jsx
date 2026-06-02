import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';
import PaymentModal from '../../components/PaymentModal';

export const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openSectionId, setOpenSectionId] = useState(null);
  
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    }
  });

  const { data: codingExercises = [] } = useQuery({
    queryKey: ['codingExercises', id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}/coding-exercises`);
      return res.data;
    }
  });

  const { data: enrolledCourses = [] } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: async () => {
      const res = await api.get('/courses/enrolled');
      return res.data;
    }
  });

  const isEnrolled = enrolledCourses.some(e => e.course.id === id);

  const handleEnrollClick = () => {
    if (isEnrolled) {
      const firstVideoId = course?.sections?.[0]?.videos?.[0]?.id || 'start';
      navigate(`/learn/${id}/${firstVideoId}`);
      return;
    }
    if (course.price > 0) {
      setShowPayment(true);
      return;
    }
    navigate(`/courses/${id}/diagnostic`);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    navigate(`/courses/${id}/diagnostic`);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (reviewRating < 1 || reviewRating > 5) return;
    setIsSubmittingReview(true);
    try {
      await api.post(`/courses/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewComment("");
      setReviewRating(5);
      queryClient.invalidateQueries(['course', id]);
    } catch (err) {
      console.error("Yorum gönderilemedi", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0F172A] flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error || !course) return (
    <div className="min-h-screen bg-[#0F172A] flex justify-center items-center">
      <div className="text-error bg-error/10 p-6 rounded-2xl border border-error/20 font-bold">Kurs bulunamadı!</div>
    </div>
  );

  const totalLessons = course.sections?.reduce((acc, s) => acc + (s.videos?.length || 0), 0) || 0;
  const rating = course.reviews?.length > 0 ? (course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length).toFixed(1) : '5.0';
  const hasReviewed = course.reviews?.some(r => r.user_id === user?.id);

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24 text-slate-300">
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-6 lg:px-12 border-b border-white/10 bg-[#1E293B]/50">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Hero Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold text-emerald-400">
                {course.category}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-lg border border-yellow-400/20">
                <span className="material-symbols-outlined text-[16px]">star</span>
                {rating}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              {course.title}
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed">
              {course.description || "Bu eğitim, kendi hızınızda ilerleyebileceğiniz ve eksiklerinizi yapay zeka ile tamamlayabileceğiniz interaktif bir müfredat sunar."}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div 
                className="flex items-center gap-3 cursor-pointer group bg-white/5 pr-4 pl-2 py-2 rounded-full border border-white/10 hover:border-primary/50 transition-all"
                onClick={() => navigate(`/instructor/${course.instructor_id}`)}
              >
                <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">person</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1">
                    Eğitmen
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">group</span>
                <span className="text-sm font-semibold">{course.students || 0} Öğrenci</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Video Thumbnail */}
          <div className="w-full lg:w-[480px] shrink-0">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              {course.thumbnail_url ? (
                <img src={course.thumbnail_url.startsWith('/uploads') ? `http://localhost:8000${course.thumbnail_url}` : course.thumbnail_url} alt="Kapak" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-white/20">play_circle</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl ml-1">play_arrow</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Layout (2 Columns) */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
        
        {/* Left Column: Curriculum & Details */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          {/* Ne Öğreneceksiniz */}
          <div className="bg-[#1E293B] border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Ne Öğreneceksiniz?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.tags && course.tags.length > 0 ? course.tags.map((tag, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">check_circle</span>
                  <span className="text-slate-300">{tag}</span>
                </div>
              )) : (
                <div className="flex items-start gap-3 col-span-2">
                  <span className="text-slate-400">Bu kurs için konu etiketleri girilmemiş. Eğitim içeriklerini aşağıdaki müfredattan inceleyebilirsiniz.</span>
                </div>
              )}
            </div>
          </div>

          {/* Curriculum */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Eğitim Müfredatı</h3>
              <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                {course.sections?.length || 0} Bölüm • {totalLessons} Ders
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {course.sections?.map((section, idx) => (
                <div key={section.id} className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenSectionId(openSectionId === section.id ? null : section.id)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left focus:outline-none group"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                        Bölüm {idx + 1}: {section.title}
                      </span>
                      <span className="text-sm text-slate-400">{section.videos?.length || 0} ders</span>
                    </div>
                    <span className={`material-symbols-outlined text-slate-400 transform transition-transform duration-300 ${openSectionId === section.id ? 'rotate-180 text-primary' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  
                  {openSectionId === section.id && (
                    <div className="border-t border-white/10 bg-black/20 px-6 py-4 flex flex-col gap-2">
                      {section.videos?.map((video, vIdx) => (
                        <div key={video.id} className="flex items-center justify-between py-3 px-4 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group/item">
                          <div className="flex items-center gap-4">
                            <span className={`material-symbols-outlined text-[20px] ${isEnrolled || video.is_preview ? 'text-primary' : 'text-slate-500'}`}>
                              {isEnrolled || video.is_preview ? 'play_circle' : 'lock'}
                            </span>
                            <span className="text-sm font-medium text-slate-300 group-hover/item:text-white transition-colors">
                              {idx + 1}.{vIdx + 1} {video.title}
                            </span>
                          </div>
                          {video.is_preview && !isEnrolled && (
                            <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md">Önizleme</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Coding Exercises */}
          {codingExercises.length > 0 && (
            <div className="mt-8">
              <div className="flex items-end justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">code</span>
                  Kodlama Ödevleri
                </h3>
                <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  {codingExercises.length} Görev
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {codingExercises.map((exercise) => (
                  <div key={exercise.id} className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden p-5 flex items-center justify-between hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">terminal</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">{exercise.title}</h4>
                        <p className="text-slate-400 text-sm mt-0.5">Dil: {exercise.language.toUpperCase()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/courses/${id}/coding/${exercise.id}`)}
                      className="bg-primary/20 text-primary font-bold px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-colors"
                    >
                      {isEnrolled ? "Görevi Çöz" : "İncele"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Reviews */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Öğrenci Değerlendirmeleri</h3>
            
            {isEnrolled && !hasReviewed && (
              <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 mb-6">
                <h4 className="text-white font-bold mb-4">Bu Kursu Değerlendir</h4>
                <form onSubmit={submitReview} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className="material-symbols-outlined cursor-pointer text-2xl transition-colors"
                        style={{
                          color: star <= reviewRating ? "#eab308" : "#475569",
                          fontVariationSettings: "'FILL' 1"
                        }}
                        onClick={() => setReviewRating(star)}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <textarea 
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-slate-300 focus:outline-none focus:border-primary transition-colors resize-none"
                    rows="3"
                    placeholder="Eğitim hakkında ne düşünüyorsunuz?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={isSubmittingReview || !reviewComment.trim()}
                    className="self-end bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? "Gönderiliyor..." : "Yorum Yap"}
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.reviews && course.reviews.length > 0 ? course.reviews.map(review => (
                <div key={review.id} className="bg-[#1E293B] p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-400">person</span>
                      </div>
                      <span className="font-bold text-white">Öğrenci</span>
                    </div>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>
                          {i < review.rating ? 'star' : 'star_border'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">"{review.comment}"</p>
                </div>
              )) : (
                <div className="col-span-2 text-slate-400 bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                  Henüz değerlendirme yapılmamış. İlk değerlendiren siz olun!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Sidebar Card */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 bg-[#1E293B] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8 border-b border-white/10 pb-8">
              <span className="text-5xl font-black text-white tracking-tight block mb-2">
                {course.price > 0 ? `$${course.price}` : 'Ücretsiz'}
              </span>
              <p className="text-slate-400 text-sm">30 Gün Para İade Garantisi</p>
            </div>
            
            <button 
              onClick={handleEnrollClick} 
              className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-6"
            >
              {isEnrolled ? "Eğitime Devam Et" : "Şimdi Kayıt Ol"}
              <span className="material-symbols-outlined text-[20px]">
                {isEnrolled ? "play_arrow" : "arrow_forward"}
              </span>
            </button>

            {!isEnrolled && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">psychology</span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Kayıt olmadan önce bilginizi ölçecek kısa bir <span className="font-bold text-white">önkoşul testine</span> gireceksiniz.
                </p>
              </div>
            )}
            
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3 text-slate-300">
                <span className="material-symbols-outlined text-slate-500">schedule</span>
                Kendi hızınızda ilerleyin
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="material-symbols-outlined text-slate-500">all_inclusive</span>
                Ömür boyu erişim
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="material-symbols-outlined text-slate-500">devices</span>
                Mobil ve masaüstü uyumlu
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="material-symbols-outlined text-slate-500">military_tech</span>
                Bitirme sertifikası
              </li>
            </ul>
          </div>
        </div>

      </div>

      {showPayment && course && (
        <PaymentModal 
          course={course}
          onClose={() => setShowPayment(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default CourseDetail;
