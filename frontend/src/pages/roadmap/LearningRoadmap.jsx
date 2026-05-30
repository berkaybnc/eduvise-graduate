export const Roadmap = () => {
  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-surface-bright bg-dot-pattern overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        .bg-dot-pattern {
            background-image: radial-gradient(var(--tw-colors-outline-variant) 1px, transparent 1px);
            background-size: 24px 24px;
        }
        .graph-line {
            stroke: var(--tw-colors-outline-variant);
            stroke-width: 1px;
            stroke-dasharray: 4 4;
            fill: none;
        }
      `}} />
      {/* Knowledge Graph Canvas */}
      <section className="flex-1 relative">
        {/* SVG Overlay for Connection Lines */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Data Structures to Graph Theory */}
          <path className="graph-line" d="M 250 200 L 450 350"></path>
          {/* Discrete Math to Graph Theory */}
          <path className="graph-line" d="M 200 450 L 450 350"></path>
          {/* Graph Theory to Probability (Gap) */}
          <path className="graph-line" d="M 450 350 L 500 600" stroke="var(--tw-colors-error)" strokeOpacity="0.3"></path>
          {/* Graph Theory to Neural Networks */}
          <path className="graph-line" d="M 450 350 L 750 400"></path>
          {/* Probability to Neural Networks */}
          <path className="graph-line" d="M 500 600 L 750 400"></path>
        </svg>
        {/* Node: Data Structures (Mastered) */}
        <button className="absolute top-[200px] left-[250px] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group focus:outline-none">
          <div className="w-16 h-16 rounded-full bg-surface border-2 border-secondary flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.02)] group-hover:bg-secondary-container transition-colors">
            <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          </div>
          <span className="mt-sm font-label-sm text-label-sm text-on-surface px-2 py-1 bg-surface border border-outline-variant rounded-DEFAULT shadow-sm whitespace-nowrap">Data Structures</span>
        </button>
        {/* Node: Discrete Math (Mastered) */}
        <button className="absolute top-[450px] left-[200px] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group focus:outline-none">
          <div className="w-16 h-16 rounded-full bg-surface border-2 border-secondary flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.02)] group-hover:bg-secondary-container transition-colors">
            <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          </div>
          <span className="mt-sm font-label-sm text-label-sm text-on-surface px-2 py-1 bg-surface border border-outline-variant rounded-DEFAULT shadow-sm whitespace-nowrap">Discrete Math</span>
        </button>
        {/* Node: Graph Theory (Current - Active) */}
        <button className="absolute top-[350px] left-[450px] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group focus:outline-none">
          <div className="w-20 h-20 rounded-full bg-primary border-2 border-primary-container flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] ring-4 ring-primary/20">
            <span className="material-symbols-outlined text-on-primary text-[32px]">hub</span>
          </div>
          <span className="mt-sm font-label-sm text-label-sm font-bold text-primary px-3 py-1 bg-surface border border-primary rounded-DEFAULT shadow-sm whitespace-nowrap">Graph Theory</span>
        </button>
        {/* Node: Probability (Gap - Red) */}
        <button className="absolute top-[600px] left-[500px] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group focus:outline-none">
          <div className="w-16 h-16 rounded-full bg-surface border-2 border-error flex items-center justify-center border-dashed group-hover:bg-error-container transition-colors">
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <span className="mt-sm font-label-sm text-label-sm text-error px-2 py-1 bg-surface border border-error rounded-DEFAULT shadow-sm whitespace-nowrap">Probability Gap</span>
        </button>
        {/* Node: Neural Networks (Upcoming - Gray) */}
        <button className="absolute top-[400px] left-[750px] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group focus:outline-none">
          <div className="w-16 h-16 rounded-full bg-surface-container-low border-2 border-outline-variant flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-outline">lock</span>
          </div>
          <span className="mt-sm font-label-sm text-label-sm text-outline px-2 py-1 bg-surface-container-low border border-outline-variant rounded-DEFAULT shadow-sm whitespace-nowrap">Neural Networks</span>
        </button>
        {/* Canvas Controls (Bottom Right) */}
        <div className="absolute bottom-lg right-lg flex flex-col gap-xs bg-surface border border-outline-variant p-1 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-DEFAULT transition-colors"><span className="material-symbols-outlined text-[20px]">add</span></button>
          <div className="h-[1px] bg-outline-variant w-full my-1"></div>
          <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-DEFAULT transition-colors"><span className="material-symbols-outlined text-[20px]">remove</span></button>
          <div className="h-[1px] bg-outline-variant w-full my-1"></div>
          <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-DEFAULT transition-colors"><span className="material-symbols-outlined text-[20px]">fit_screen</span></button>
        </div>
      </section>
      {/* Right Detail Panel */}
      <aside className="w-[340px] bg-surface border-l border-outline-variant flex flex-col h-full z-30 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Panel Header */}
        <div className="p-lg border-b border-outline-variant">
          <div className="flex items-center gap-2 mb-xs">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Current Focus</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Graph Theory</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">Understand networks, routing, and relationships through nodes and edges.</p>
        </div>
        {/* Panel Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-lg space-y-lg">
          {/* AI Insights */}
          <div className="bg-surface-bright border border-outline-variant rounded-lg overflow-hidden">
            <div className="bg-secondary-fixed-dim/20 px-md py-sm border-b border-outline-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">psychology</span>
              <h3 className="font-label-md text-label-md font-semibold text-on-secondary-container">AI Insight</h3>
            </div>
            <div className="p-md">
              <p className="font-body-sm text-body-sm text-on-surface">Based on your recent quiz scores, <strong className="font-medium">focus heavily on adjacency matrices</strong> before proceeding to spanning trees. You showed slight hesitation in array representations.</p>
            </div>
          </div>
          {/* Stats Grid (Bento style) */}
          <div className="grid grid-cols-2 gap-sm">
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md">
              <span className="material-symbols-outlined text-outline mb-xs block">schedule</span>
              <div className="font-label-sm text-label-sm text-outline uppercase">Est. Time</div>
              <div className="font-body-lg text-body-lg text-on-surface font-medium">4h 30m</div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md">
              <span className="material-symbols-outlined text-outline mb-xs block">trending_up</span>
              <div className="font-label-sm text-label-sm text-outline uppercase">Difficulty</div>
              <div className="font-body-lg text-body-lg text-on-surface font-medium">High</div>
            </div>
          </div>
          {/* Progress Track */}
          <div>
            <div className="flex justify-between items-center mb-sm">
              <h3 className="font-label-md text-label-md text-on-surface font-semibold">Module Progress</h3>
              <span className="font-mono text-mono text-primary">25%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-1/4"></div>
            </div>
          </div>
          {/* Prerequisites */}
          <div>
            <h3 className="font-label-md text-label-md text-on-surface font-semibold border-b border-outline-variant pb-xs mb-sm">Prerequisites</h3>
            <ul className="space-y-sm">
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-secondary text-[18px] mt-[2px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div>
                  <div className="font-body-sm text-body-sm text-on-surface">Data Structures</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Mastered • Oct 12</div>
                </div>
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-secondary text-[18px] mt-[2px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div>
                  <div className="font-body-sm text-body-sm text-on-surface">Discrete Mathematics</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Mastered • Oct 20</div>
                </div>
              </li>
              <li className="flex items-start gap-sm bg-error-container/30 p-2 rounded-DEFAULT -mx-2 border border-error-container">
                <span className="material-symbols-outlined text-error text-[18px] mt-[2px]">warning</span>
                <div>
                  <div className="font-body-sm text-body-sm text-error font-medium">Probability Basics</div>
                  <div className="font-label-sm text-label-sm text-error/80">Skill gap detected</div>
                  <a className="font-label-sm text-label-sm text-primary underline mt-xs inline-block" href="#">Review Module</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {/* Panel Footer Actions */}
        <div className="p-lg border-t border-outline-variant bg-surface-container-lowest">
          <button className="w-full bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-label-md text-label-md font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2">
            Continue Learning
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Roadmap;
