
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    }
  });

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      alert("Başarıyla kayıt olundu!");
      navigate('/dashboard');
    } catch {
      alert("Kayıt olurken bir hata oluştu veya zaten kayıtlısınız.");
    }
  };

  if (isLoading) return <div className="p-8">Yükleniyor...</div>;
  if (error || !course) return <div className="p-8 text-error">Kurs bulunamadı!</div>;

  return (
    <div className="w-full max-w-max-content-width mx-auto pb-xl">
      {/* Hero Section */}
      <section className="w-full bg-surface-variant border-b border-outline-variant">
        <div className="p-lg md:p-xl flex flex-col md:flex-row gap-lg md:gap-xl items-center">
          {/* Hero Image */}
          <div className="w-full md:w-1/2 aspect-video rounded-lg overflow-hidden border border-outline shadow-sm relative group bg-gradient-to-r from-blue-500 to-purple-500">
          </div>
          {/* Hero Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <div className="flex items-center gap-xs mb-sm">
              <span className="bg-tertiary-container/10 text-tertiary px-sm py-[2px] rounded-DEFAULT text-label-sm font-label-sm font-semibold border border-tertiary/20">{course.category}</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1", color: "#eab308"}}>star</span>
                Yeni
              </span>
            </div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-sm">{course.title}</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant mb-md max-w-xl">
              {course.description}
            </p>
            <div className="flex items-center gap-md mb-lg">
              <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-outline-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate(`/instructor/${course.instructor_id}`)}
              >
                <p className="text-label-md font-label-md text-on-surface hover:text-primary transition-colors flex items-center gap-1">
                  Eğitmen
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Profilini İncele</p>
              </div>
            </div>
            <button onClick={handleEnroll} className="bg-primary text-on-primary px-xl py-md rounded-DEFAULT text-label-md font-label-md font-semibold hover:bg-surface-tint transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-sm">
              Enroll Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
      {/* Main Content Layout (2 Columns) */}
      <div className="p-lg md:p-xl grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
        {/* Left Column: Curriculum */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          <div className="flex items-center justify-between border-b border-outline-variant pb-sm">
            <h3 className="text-headline-md font-headline-md text-on-surface">Course Curriculum</h3>
            <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container px-sm py-xs rounded-DEFAULT">12 Lessons • 2h 00m</span>
          </div>
          {/* Accordion Wrapper */}
          <div className="flex flex-col gap-sm">
            {/* Module 1 */}
            <div className="border border-outline-variant rounded-DEFAULT bg-surface overflow-hidden group">
              <button className="w-full p-md flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left focus:outline-none">
                <div className="flex flex-col">
                  <span className="text-label-md font-label-md text-on-surface font-semibold group-hover:text-primary transition-colors">Module 1: Introduction to Graphs</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant mt-xs">3 lessons • 15m</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant transform transition-transform duration-200">expand_more</span>
              </button>
              {/* Content (Simulated open state) */}
              <div className="border-t border-outline-variant bg-surface px-md py-sm flex flex-col gap-xs">
                <div className="flex items-center justify-between py-xs px-sm hover:bg-surface-container-low rounded-sm cursor-pointer transition-colors group/item">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[18px] text-primary">play_circle</span>
                    <span className="text-body-sm font-body-sm text-on-surface group-hover/item:text-primary transition-colors">1.1 What is a Graph?</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">05:00</span>
                </div>
                <div className="flex items-center justify-between py-xs px-sm hover:bg-surface-container-low rounded-sm cursor-pointer transition-colors group/item">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">lock</span>
                    <span className="text-body-sm font-body-sm text-on-surface group-hover/item:text-primary transition-colors">1.2 Terminology &amp; Notation</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">06:30</span>
                </div>
              </div>
            </div>
            {/* Module 2 */}
            <div className="border border-outline-variant rounded-DEFAULT bg-surface overflow-hidden group">
              <button className="w-full p-md flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left focus:outline-none">
                <div className="flex flex-col">
                  <span className="text-label-md font-label-md text-on-surface font-semibold group-hover:text-primary transition-colors">Module 2: Traversal Algorithms</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant mt-xs">5 lessons • 45m</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant transform transition-transform duration-200">chevron_right</span>
              </button>
            </div>
            {/* Module 3 */}
            <div className="border border-outline-variant rounded-DEFAULT bg-surface overflow-hidden group">
              <button className="w-full p-md flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left focus:outline-none">
                <div className="flex flex-col">
                  <span className="text-label-md font-label-md text-on-surface font-semibold group-hover:text-primary transition-colors">Module 3: Shortest Path Problems</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant mt-xs">4 lessons • 60m</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant transform transition-transform duration-200">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        {/* Right Column: Sticky Sidebar Card */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-[88px] bg-surface border border-outline-variant rounded-lg p-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col gap-md">
            <div className="flex items-end justify-between border-b border-outline-variant pb-md">
              <div>
                <span className="text-headline-lg font-headline-lg text-on-surface font-bold tracking-tight">$89.99</span>
                <span className="text-body-sm font-body-sm text-on-surface-variant line-through ml-xs">$129.99</span>
              </div>
              <span className="bg-error-container text-on-error-container px-sm py-xs rounded-DEFAULT text-label-sm font-label-sm font-semibold">30% OFF</span>
            </div>
            <button onClick={handleEnroll} className="w-full bg-primary text-on-primary py-md rounded-DEFAULT text-label-md font-label-md font-bold hover:bg-surface-tint transition-all shadow-sm active:scale-95">
              Enroll Now
            </button>
            <p className="text-center text-label-sm font-label-sm text-on-surface-variant mt-[-8px]">30-Day Money-Back Guarantee</p>
            <div className="pt-md border-t border-outline-variant">
              <h4 className="text-label-md font-label-md text-on-surface font-semibold mb-sm">What you will learn</h4>
              <ul className="flex flex-col gap-sm">
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[18px] text-primary mt-[2px]">check_circle</span>
                  <span className="text-body-sm font-body-sm text-on-surface">Implement Dijkstra's Algorithm from scratch</span>
                </li>
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[18px] text-primary mt-[2px]">check_circle</span>
                  <span className="text-body-sm font-body-sm text-on-surface">Master A* Search heuristics</span>
                </li>
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[18px] text-primary mt-[2px]">check_circle</span>
                  <span className="text-body-sm font-body-sm text-on-surface">Analyze Network Flow and Bipartite Matching</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Section: Instructor & Reviews */}
      <div className="px-lg md:px-xl pb-xl w-full max-w-4xl border-t border-outline-variant pt-xl mt-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
          {/* Instructor Bio */}
          <div>
            <h3 className="text-headline-md font-headline-md text-on-surface border-b border-outline-variant pb-sm mb-md">About the Instructor</h3>
            <div 
              className="flex gap-md items-start p-4 rounded-xl border border-outline-variant hover:border-primary/50 hover:bg-surface-container-lowest cursor-pointer transition-all group"
              onClick={() => navigate(`/instructor/${course.instructor_id}`)}
            >
              <div className="w-16 h-16 rounded-full bg-surface-container overflow-hidden border border-outline-variant shrink-0 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">person</span>
              </div>
              <div className="flex flex-col gap-xs flex-1">
                <h4 className="text-label-md font-label-md text-on-surface font-semibold group-hover:text-primary flex items-center gap-2 transition-colors">
                  Eğitmen
                  <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </h4>
                <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                  Eğitmenin profiline giderek diğer kurslarını inceleyebilir ve hakkında daha fazla bilgi edinebilirsiniz.
                </p>
              </div>
            </div>
          </div>
          {/* Reviews Summary */}
          <div>
            <h3 className="text-headline-md font-headline-md text-on-surface border-b border-outline-variant pb-sm mb-md">Student Reviews</h3>
            <div className="flex flex-col gap-md">
              {/* Single Review */}
              <div className="bg-surface-container-lowest p-md rounded-DEFAULT border border-outline-variant">
                <div className="flex items-center justify-between mb-xs">
                  <span className="text-label-md font-label-md text-on-surface font-medium">Alex M.</span>
                  <div className="flex text-primary">
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">"Incredible clarity on A* search. The visual node representations in the exercises finally made it click for me."</p>
              </div>
              {/* Single Review */}
              <div className="bg-surface-container-lowest p-md rounded-DEFAULT border border-outline-variant">
                <div className="flex items-center justify-between mb-xs">
                  <span className="text-label-md font-label-md text-on-surface font-medium">Jordan K.</span>
                  <div className="flex text-primary">
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]">star_half</span>
                  </div>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">"Pacing is fast, but the content is extremely thorough. Great prep for technical interviews."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
