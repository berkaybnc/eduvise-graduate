import React from 'react';

export const Reports = () => {
  return (
    <div className="w-full h-full pb-xl">
      <div className="max-w-[1200px] mx-auto p-4 md:p-lg">
        {/* Header Section */}
        <div className="mb-lg pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full mb-3 border border-outline-variant">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface">Fall Semester Complete</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Alex's Learning Journey - Semester Report</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Comprehensive analysis of technical competencies, skill progression, and AI-recommended pathways for continued professional development.</p>
        </div>
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg mb-lg">
          {/* Radar Chart Card (Left) */}
          <div className="md:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col shadow-sm">
            <div className="border-b border-outline-variant pb-3 mb-4 flex justify-between items-end">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Skill Gap Analysis</h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Initial vs. Current Mastery</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-surface-variant border border-outline-variant"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Initial State</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-secondary/20 border border-secondary"></span>
                  <span className="font-label-sm text-label-sm text-secondary">Current Mastery</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-[350px] relative flex items-center justify-center bg-surface-bright rounded-lg border border-surface-variant">
              {/* Stylized SVG Radar Chart representing the graphic requested */}
              <svg className="w-full h-full max-w-[320px] max-h-[320px]" viewBox="0 0 400 400">
                {/* Grid */}
                <polygon fill="none" points="200,50 330,125 330,275 200,350 70,275 70,125" stroke="#e1e3e4" strokeWidth="1"></polygon>
                <polygon fill="none" points="200,100 286,150 286,250 200,300 114,250 114,150" stroke="#e1e3e4" strokeWidth="1"></polygon>
                <polygon fill="none" points="200,150 243,175 243,225 200,250 157,225 157,175" stroke="#e1e3e4" strokeWidth="1"></polygon>
                {/* Axes */}
                <line stroke="#e1e3e4" strokeDasharray="4" strokeWidth="1" x1="200" x2="200" y1="200" y2="50"></line>
                <line stroke="#e1e3e4" strokeDasharray="4" strokeWidth="1" x1="200" x2="330" y1="200" y2="125"></line>
                <line stroke="#e1e3e4" strokeDasharray="4" strokeWidth="1" x1="200" x2="330" y1="200" y2="275"></line>
                <line stroke="#e1e3e4" strokeDasharray="4" strokeWidth="1" x1="200" x2="200" y1="200" y2="350"></line>
                <line stroke="#e1e3e4" strokeDasharray="4" strokeWidth="1" x1="200" x2="70" y1="200" y2="275"></line>
                <line stroke="#e1e3e4" strokeDasharray="4" strokeWidth="1" x1="200" x2="70" y1="200" y2="125"></line>
                {/* Initial State Polygon */}
                <polygon fill="#e1e3e4" fillOpacity="0.4" points="200,120 250,150 260,230 200,260 140,240 130,140" stroke="#737686" strokeWidth="1"></polygon>
                {/* Current Mastery Polygon */}
                <polygon fill="rgba(13, 148, 136, 0.2)" points="200,60 300,140 290,260 200,320 90,260 80,130" stroke="#0D9488" strokeWidth="2"></polygon>
                {/* Current Mastery Nodes */}
                <circle cx="200" cy="60" fill="#0D9488" r="4"></circle>
                <circle cx="300" cy="140" fill="#0D9488" r="4"></circle>
                <circle cx="290" cy="260" fill="#0D9488" r="4"></circle>
                <circle cx="200" cy="320" fill="#0D9488" r="4"></circle>
                <circle cx="90" cy="260" fill="#0D9488" r="4"></circle>
                <circle cx="80" cy="130" fill="#0D9488" r="4"></circle>
                {/* Labels */}
                <text fill="#434654" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="middle" x="200" y="35">Data Structs</text>
                <text fill="#434654" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="start" x="345" y="125">Algorithms</text>
                <text fill="#434654" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="start" x="345" y="280">Sys Design</text>
                <text fill="#434654" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="middle" x="200" y="375">Testing</text>
                <text fill="#434654" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="end" x="55" y="280">Frontend</text>
                <text fill="#434654" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="end" x="55" y="125">Backend</text>
              </svg>
            </div>
          </div>
          {/* Stats & Checklist (Right) */}
          <div className="md:col-span-5 flex flex-col gap-lg">
            {/* Mastery Stats Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
              <div className="border-b border-outline-variant pb-2 mb-4">
                <h2 className="font-headline-md text-headline-md text-on-surface">Mastery Stats</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary-container/10 rounded-lg border border-primary-fixed">
                  <span className="material-symbols-outlined text-primary mb-2" style={{fontVariationSettings: "'wght' 300, 'FILL' 1"}}>trending_up</span>
                  <div className="font-headline-lg text-headline-lg text-primary mb-1">92%</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Increase in Coding Fluency</div>
                </div>
                <div className="p-3 bg-secondary-container/10 rounded-lg border border-secondary-fixed">
                  <span className="material-symbols-outlined text-secondary mb-2" style={{fontVariationSettings: "'wght' 300, 'FILL' 1"}}>task_alt</span>
                  <div className="font-headline-lg text-headline-lg text-secondary mb-1">85%</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Overall Completion Rate</div>
                </div>
              </div>
            </div>
            {/* Competency Checklist Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm flex-1">
              <div className="border-b border-outline-variant pb-2 mb-4 flex justify-between items-center">
                <h2 className="font-headline-md text-headline-md text-on-surface">Competency Checklist</h2>
                <span className="font-label-sm text-label-sm px-2 py-1 bg-surface-container-high rounded text-on-surface-variant">12/15 Core</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5" style={{fontVariationSettings: "'wght' 400, 'FILL' 1"}}>check_circle</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">Advanced Graph Algorithms</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Mastered Dijkstra's and A* implementations.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5" style={{fontVariationSettings: "'wght' 400, 'FILL' 1"}}>check_circle</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">React State Management</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Proficient with Context API and Redux Toolkit.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5" style={{fontVariationSettings: "'wght' 400, 'FILL' 1"}}>check_circle</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">RESTful API Design</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Consistently applies proper verbs and status codes.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 opacity-60">
                  <span className="material-symbols-outlined text-outline mt-0.5" style={{fontVariationSettings: "'wght' 300, 'FILL' 0"}}>radio_button_unchecked</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">Microservices Architecture</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">In progress. Focus on inter-service communication needed.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Section: Recommended Next Steps */}
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Recommended Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {/* Course Card 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm hover:border-primary transition-colors cursor-pointer group">
              <div className="h-32 mb-4 rounded-lg bg-surface-container overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-tint/10 to-surface-tint/5 mix-blend-multiply"></div>
                <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary opacity-20 text-5xl" style={{fontVariationSettings: "'wght' 300"}}>policy</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-label-sm text-label-sm text-primary px-2 py-1 bg-primary-container/20 rounded">AI Alignment</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" style={{fontVariationSettings: "'wght' 300"}}>arrow_forward</span>
              </div>
              <h3 className="font-label-md text-label-md text-on-surface mb-1">AI Ethics III</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Deep dive into bias mitigation and transparent modeling techniques for production ML systems.</p>
            </div>
            {/* Course Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm hover:border-primary transition-colors cursor-pointer group">
              <div className="h-32 mb-4 rounded-lg bg-surface-container overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-secondary/5 mix-blend-multiply"></div>
                <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary opacity-20 text-5xl" style={{fontVariationSettings: "'wght' 300"}}>architecture</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-label-sm text-label-sm text-secondary px-2 py-1 bg-secondary-container/20 rounded">Practical App</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" style={{fontVariationSettings: "'wght' 300"}}>arrow_forward</span>
              </div>
              <h3 className="font-label-md text-label-md text-on-surface mb-1">Real-world Project Seminar</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Capstone project simulating a startup environment to bridge the gap in Microservices architecture.</p>
            </div>
            {/* Course Card 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm hover:border-primary transition-colors cursor-pointer group">
              <div className="h-32 mb-4 rounded-lg bg-surface-container overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 to-tertiary/5 mix-blend-multiply"></div>
                <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-tertiary opacity-20 text-5xl" style={{fontVariationSettings: "'wght' 300"}}>cloud</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-label-sm text-label-sm text-tertiary px-2 py-1 bg-tertiary-container/20 rounded">Infrastructure</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" style={{fontVariationSettings: "'wght' 300"}}>arrow_forward</span>
              </div>
              <h3 className="font-label-md text-label-md text-on-surface mb-1">Cloud Deployment Ops</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Master container orchestration and CI/CD pipelines to strengthen backend deployment skills.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
