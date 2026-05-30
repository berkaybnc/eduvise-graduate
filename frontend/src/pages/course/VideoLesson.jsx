
export const Learn = () => {
  return (
    <div className="flex-1 p-lg max-w-max-content-width mx-auto w-full flex flex-col lg:flex-row gap-xl pb-xl">
      {/* Left Column: Main Learning Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video Player Container */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-sm border border-outline-variant group cursor-pointer">
          <img className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" alt="A high-quality educational video still showing a complex network graph" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnEhW4xOBe0HbhcUzMM5ZEGH3OOh1tAk9eEJhnZox9qd2R7c0CCVdB7z7mO5f18I8RB3X1vHbWHRHkyXRBo-FD4YFWqPbrghJQ5tOafxzQb1uusnv4gIsCiazbGo-EXwdwIRjhp_cvyAKFrBfZUEewbyU5nsV8XRDyUmP8zb9YZr6WtDu3iNrTmYUOANK8JV0MR5oZAExA5EO7-AL0NjTWkiDni_I9lrd3BA3WmOGeBDLgA_9hX5H1GUfTEOJI7uuOuUHd5a2NSK1K"/>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-surface/20 backdrop-blur-md flex items-center justify-center border border-on-secondary/30 text-on-secondary shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[40px]" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
            </div>
          </div>
          {/* Fake Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-dim/30">
            <div className="h-full bg-primary w-[35%]"></div>
          </div>
        </div>
        {/* Lesson Header */}
        <div className="mt-lg">
          <div className="flex items-center gap-sm mb-xs">
            <span className="text-label-sm font-label-sm text-primary uppercase tracking-wider bg-primary/10 px-xs py-[2px] rounded">Module 4</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant">12:45 min</span>
          </div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface md:text-headline-lg md:font-headline-lg">Dijkstra's Algorithm Explained</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-sm max-w-3xl">
            Understand the core mechanics of finding the shortest paths between nodes in a graph. We will step through the initialization, the priority queue implementation, and edge relaxation.
          </p>
        </div>
        {/* AI Assistant Panel */}
        <div className="mt-lg p-md border border-secondary rounded-lg bg-surface-bright flex gap-md items-start shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
          <div className="p-sm bg-secondary/10 rounded-full text-secondary shrink-0">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
          <div>
            <h4 className="text-label-md font-label-md text-secondary mb-xs">AI Learning Assistant</h4>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Based on your progress, focus on <strong className="text-on-surface font-medium">Priority Queues</strong> before continuing. This will ensure mastery of Dijkstra's implementation.
            </p>
            <button className="mt-sm text-label-sm font-label-sm text-secondary hover:underline flex items-center gap-xs">
              Review Priority Queues <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Downloads & Resources */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Ders Kaynakları</h3>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-secondary">picture_as_pdf</span>
              <span className="font-bold text-sm">Sunum_Notlari.pdf</span>
              <span className="material-symbols-outlined text-sm ml-2">download</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-tertiary">folder_zip</span>
              <span className="font-bold text-sm">Kaynak_Kodlar.zip</span>
              <span className="material-symbols-outlined text-sm ml-2">download</span>
            </button>
          </div>
        </div>

        {/* Reviews and Ratings */}
        <div className="mt-8 border-t border-outline-variant pt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Öğrenci Değerlendirmeleri</h3>
            <button className="text-primary font-bold hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">edit</span>
              Değerlendir
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">A</div>
                <span className="font-bold">Ahmet Yılmaz</span>
                <span className="text-secondary ml-auto text-sm">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-on-surface-variant text-sm">Eğitmen konuyu harika anlatmış. Verdiği notlar çok işime yaradı.</p>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center font-bold text-sm">M</div>
                <span className="font-bold">Mehmet K.</span>
                <span className="text-secondary ml-auto text-sm">⭐⭐⭐⭐</span>
              </div>
              <p className="text-on-surface-variant text-sm">İyi bir kurs ancak bazı yerler hızlı geçilmiş.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Right Column: Course Content Sidebar */}
      <aside className="w-full lg:w-[320px] shrink-0">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col h-fit sticky top-24 shadow-sm">
          <div className="p-md border-b border-outline-variant">
            <h3 className="text-headline-md font-headline-md text-on-surface">Course Content</h3>
            <div className="flex items-center gap-sm mt-sm">
              <div className="h-2 flex-1 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[65%] rounded-full"></div>
              </div>
              <span className="text-label-sm font-label-sm text-on-surface-variant">65%</span>
            </div>
          </div>
          <div className="flex flex-col">
            {/* Section 1 */}
            <div className="border-b border-outline-variant last:border-0">
              <button className="w-full flex items-center justify-between p-md hover:bg-surface-bright transition-colors text-left">
                <span className="text-label-md font-label-md text-on-surface font-semibold">Graph Traversals</span>
                <span className="material-symbols-outlined text-outline-variant">expand_more</span>
              </button>
              <div className="px-sm pb-sm space-y-xs">
                <div className="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container-low cursor-pointer group">
                  <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <div className="flex-1">
                    <p className="text-body-sm font-body-sm text-on-surface">Breadth-First Search (BFS)</p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">8:20</p>
                  </div>
                </div>
                <div className="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container-low cursor-pointer group">
                  <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <div className="flex-1">
                    <p className="text-body-sm font-body-sm text-on-surface">Depth-First Search (DFS)</p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">10:15</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Section 2 */}
            <div className="border-b border-outline-variant last:border-0">
              <button className="w-full flex items-center justify-between p-md hover:bg-surface-bright transition-colors text-left bg-surface-bright">
                <span className="text-label-md font-label-md text-on-surface font-semibold">Shortest Paths</span>
                <span className="material-symbols-outlined text-outline-variant">expand_less</span>
              </button>
              <div className="px-sm pb-sm space-y-xs">
                {/* Active Item */}
                <div className="flex items-center gap-sm p-sm rounded-lg bg-primary/10 border border-primary/20 cursor-pointer">
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>play_circle</span>
                  <div className="flex-1">
                    <p className="text-body-sm font-body-sm text-primary font-medium">Dijkstra's Algorithm Explained</p>
                    <p className="text-label-sm font-label-sm text-primary/80">12:45 • Playing</p>
                  </div>
                </div>
                {/* Locked Item */}
                <div className="flex items-center gap-sm p-sm rounded-lg cursor-not-allowed opacity-60">
                  <span className="material-symbols-outlined text-outline">lock</span>
                  <div className="flex-1">
                    <p className="text-body-sm font-body-sm text-on-surface-variant">Bellman-Ford Algorithm</p>
                    <p className="text-label-sm font-label-sm text-outline">15:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-sm p-sm rounded-lg cursor-not-allowed opacity-60">
                  <span className="material-symbols-outlined text-outline">lock</span>
                  <div className="flex-1">
                    <p className="text-body-sm font-body-sm text-on-surface-variant">A* Search</p>
                    <p className="text-label-sm font-label-sm text-outline">18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Learn;
