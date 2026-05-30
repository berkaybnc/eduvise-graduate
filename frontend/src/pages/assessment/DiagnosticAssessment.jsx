import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export const DiagnosticAssessment = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // API call to real endpoint
      await api.post('/assessments/diagnostic/submit', {
        answers: { "q12": "C" }
      });
      alert("Test sonuçlarınız başarıyla yapay zeka tarafından analiz edildi!");
      navigate('/roadmap');
    } catch {
      alert("Gönderim sırasında hata oluştu!");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)]">
      {/* Top Navigation (Diagnostic specific) */}
      <header className="w-full bg-surface-container-lowest border-b border-outline-variant h-16 flex items-center justify-between px-lg shrink-0">
        <div className="flex items-center gap-md">
          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined">close</span>
            <span className="font-label-md text-label-md">Exit</span>
          </button>
          <div className="h-6 w-px bg-outline-variant"></div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Diagnostic: Logic &amp; Ethics</h1>
        </div>
        <div className="flex items-center gap-lg">
          <div className="flex items-center gap-sm bg-surface-container-high px-sm py-[6px] rounded font-label-md text-label-md text-primary">
            <span className="material-symbols-outlined text-[18px] animate-pulse">psychology</span>
            <span>AI Analyzing...</span>
          </div>
          <div className="flex items-center gap-sm text-on-surface-variant">
            <span className="material-symbols-outlined">timer</span>
            <span className="font-mono text-mono">14:59</span>
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full max-w-max-content-width mx-auto px-lg py-xl flex flex-col lg:flex-row gap-lg">
        {/* Quiz Canvas */}
        <div className="flex-1 flex flex-col max-w-3xl">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex-1 flex flex-col">
            <div className="mb-lg border-b border-outline-variant pb-md">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Question 12 of 30</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-sm">If all A are B, and some B are C, which of the following must be true?</h2>
            </div>
            <div className="flex-1 flex flex-col gap-sm">
              {/* Option 1 */}
              <label className="group relative flex items-center p-md border border-outline-variant rounded cursor-pointer hover:bg-surface-container-low transition-colors">
                <input className="peer sr-only" name="quiz-option" type="radio"/>
                <div className="w-5 h-5 rounded-full border-2 border-outline peer-checked:border-primary peer-checked:border-[6px] transition-all mr-md shrink-0"></div>
                <span className="font-body-md text-body-md text-on-surface">All A are C.</span>
                <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded pointer-events-none transition-colors"></div>
              </label>
              {/* Option 2 */}
              <label className="group relative flex items-center p-md border border-outline-variant rounded cursor-pointer hover:bg-surface-container-low transition-colors">
                <input className="peer sr-only" name="quiz-option" type="radio"/>
                <div className="w-5 h-5 rounded-full border-2 border-outline peer-checked:border-primary peer-checked:border-[6px] transition-all mr-md shrink-0"></div>
                <span className="font-body-md text-body-md text-on-surface">Some A are C.</span>
                <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded pointer-events-none transition-colors"></div>
              </label>
              {/* Option 3 (Selected for preview) */}
              <label className="group relative flex items-center p-md border border-outline-variant rounded cursor-pointer bg-primary-fixed/30">
                <input defaultChecked className="peer sr-only" name="quiz-option" type="radio"/>
                <div className="w-5 h-5 rounded-full border-primary border-[6px] transition-all mr-md shrink-0"></div>
                <span className="font-body-md text-body-md text-on-surface">We cannot determine if any A are C based on the given information.</span>
                <div className="absolute inset-0 border-2 border-primary rounded pointer-events-none transition-colors"></div>
              </label>
              {/* Option 4 */}
              <label className="group relative flex items-center p-md border border-outline-variant rounded cursor-pointer hover:bg-surface-container-low transition-colors">
                <input className="peer sr-only" name="quiz-option" type="radio"/>
                <div className="w-5 h-5 rounded-full border-2 border-outline peer-checked:border-primary peer-checked:border-[6px] transition-all mr-md shrink-0"></div>
                <span className="font-body-md text-body-md text-on-surface">No A are C.</span>
                <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded pointer-events-none transition-colors"></div>
              </label>
            </div>
            <div className="mt-lg pt-md flex justify-between items-center">
              <button className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Skip</button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Analyzing...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar / Context */}
        <aside className="w-full lg:w-[260px] shrink-0 flex flex-col gap-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md">
            <div className="flex items-center gap-sm mb-sm text-secondary">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              <h3 className="font-label-md text-label-md font-bold uppercase tracking-wider">Cognitive Tip</h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
              When dealing with syllogisms, drawing a quick Venn diagram can help visualize the overlapping sets. Remember that "some" implies at least one, but not necessarily all.
            </p>
            <a className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-xs" href="#">
              Review Syllogistic Logic Basics
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md mt-auto hidden lg:block">
            <div className="flex justify-between items-center mb-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Progress</span>
              <span className="font-mono text-mono text-xs">40%</span>
            </div>
            {/* Progress Bar */}
            <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{width: "40%"}}></div>
            </div>
          </div>
        </aside>
      </div>
      {/* Mobile Bottom Progress (Visible only on small screens) */}
      <div className="lg:hidden w-full bg-surface-container-lowest border-t border-outline-variant p-md shrink-0">
        <div className="flex justify-between items-center mb-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Progress (12/30)</span>
          <span className="font-mono text-mono text-xs">40%</span>
        </div>
        <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{width: "40%"}}></div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticAssessment;
