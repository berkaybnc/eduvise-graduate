export const Courses = () => {
  return (
    <div className="flex-1 max-w-max-content-width w-full mx-auto">
      {/* Page Header */}
      <div className="mb-lg">
        <h2 className="text-headline-lg font-headline-lg text-on-surface mb-xs">Explore Courses</h2>
        <p className="text-body-md font-body-md text-on-surface-variant">Discover top-rated technical courses curated by AI to match your learning goals.</p>
      </div>
      {/* Top Filter Bar */}
      <div className="bg-surface border border-outline-variant rounded-xl p-md mb-lg flex flex-wrap items-center gap-md shadow-sm">
        <div className="flex items-center gap-sm">
          <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Sort By</span>
          <select className="text-body-sm font-body-sm border-none bg-surface-container rounded-lg py-xs pl-sm pr-lg focus:ring-1 focus:ring-primary cursor-pointer">
            <option>Most Popular</option>
            <option>Highest Rated</option>
            <option>Newest</option>
          </select>
        </div>
        <div className="h-6 w-px bg-outline-variant hidden sm:block"></div>
        <div className="flex flex-wrap gap-sm">
          <button className="flex items-center gap-xs px-sm py-xs border border-outline-variant rounded-lg text-label-md font-label-md text-on-surface hover:bg-surface-container-lowest transition-colors bg-surface-container-lowest shadow-[0px_2px_4px_rgba(0,0,0,0.02)]">
            Category
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          <button className="flex items-center gap-xs px-sm py-xs border border-outline-variant rounded-lg text-label-md font-label-md text-on-surface hover:bg-surface-container-lowest transition-colors bg-surface-container-lowest shadow-[0px_2px_4px_rgba(0,0,0,0.02)]">
            Level
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          <button className="flex items-center gap-xs px-sm py-xs border border-outline-variant rounded-lg text-label-md font-label-md text-on-surface hover:bg-surface-container-lowest transition-colors bg-surface-container-lowest shadow-[0px_2px_4px_rgba(0,0,0,0.02)]">
            Price
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>
        <div className="ml-auto">
          <span className="text-label-sm font-label-sm text-on-surface-variant">Showing 124 results</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-lg">
        {/* Left Column: Sidebar Filters */}
        <aside className="w-full lg:w-[280px] shrink-0 space-y-md">
          {/* Filter Block 1 */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md">
            <h3 className="text-label-md font-label-md font-bold mb-sm pb-xs border-b border-outline-variant text-on-surface">Ratings</h3>
            <div className="space-y-xs">
              <label className="flex items-center gap-sm cursor-pointer group">
                <input defaultChecked className="rounded border-outline text-primary focus:ring-primary w-4 h-4 bg-surface-container cursor-pointer" type="checkbox"/>
                <div className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B] opacity-50" style={{fontVariationSettings: "'FILL' 1"}}>star_half</span>
                  <span className="ml-xs">4.5 &amp; up</span>
                </div>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input className="rounded border-outline text-primary focus:ring-primary w-4 h-4 bg-surface-container cursor-pointer" type="checkbox"/>
                <div className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-[16px] text-outline-variant" style={{fontVariationSettings: "'FILL' 1"}}>star_border</span>
                  <span className="ml-xs">4.0 &amp; up</span>
                </div>
              </label>
            </div>
          </div>
          {/* Filter Block 2 */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md">
            <h3 className="text-label-md font-label-md font-bold mb-sm pb-xs border-b border-outline-variant text-on-surface">Duration</h3>
            <div className="space-y-xs">
              <label className="flex items-center gap-sm cursor-pointer group">
                <input className="rounded border-outline text-primary focus:ring-primary w-4 h-4 bg-surface-container cursor-pointer" type="checkbox"/>
                <span className="text-body-sm font-body-sm text-on-surface group-hover:text-primary transition-colors">0-2 Hours</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input defaultChecked className="rounded border-outline text-primary focus:ring-primary w-4 h-4 bg-surface-container cursor-pointer" type="checkbox"/>
                <span className="text-body-sm font-body-sm text-on-surface group-hover:text-primary transition-colors">3-6 Hours</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input className="rounded border-outline text-primary focus:ring-primary w-4 h-4 bg-surface-container cursor-pointer" type="checkbox"/>
                <span className="text-body-sm font-body-sm text-on-surface group-hover:text-primary transition-colors">7-15 Hours</span>
              </label>
            </div>
          </div>
        </aside>
        {/* Right Column: Course Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {/* Course Card 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-200 flex flex-col cursor-pointer group">
            <div className="h-32 bg-surface-container relative w-full overflow-hidden">
              <img alt="Code on screen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr4vCze7UFveoT8wuLznQqnTchKWREv1CgOOdgZFtlxbwNvTpweOygsoqeXIGBkzRAfbzA6kcoTv1k9jponGn0xcnXD9oPYZskGimkfqnhSepdFSsrKRIgd9UJiwtOIuHp56_V48I0I3ne4ltMpIApDNPtOFQEksyTJJQMJ1dlvdFvtIowqXlHJhrDodvE8AKsoL7Iv8Xg9hXERLnWFEJ7NUuAkZNsYEhAwYfEaqttgmJ5V-pSYavae4AXxJw2jc0K7w2Ts604sIvp"/>
              <div className="absolute top-sm left-sm bg-primary text-on-primary px-xs py-[2px] rounded text-[10px] font-label-sm font-bold uppercase tracking-wider">
                REQUIRED
              </div>
            </div>
            <div className="p-sm flex flex-col flex-1">
              <h3 className="text-label-md font-label-md font-bold text-on-surface mb-xs leading-snug group-hover:text-primary transition-colors line-clamp-2">Mastering Distributed Systems</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-sm">Dr. Sarah Chen</p>
              <div className="mt-auto">
                <div className="flex items-center gap-xs mb-xs">
                  <span className="text-label-sm font-label-sm font-bold text-[#F59E0B]">4.8</span>
                  <span className="material-symbols-outlined text-[14px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">(1.2k students)</span>
                </div>
                <div className="flex items-center justify-between border-t border-outline-variant pt-xs mt-xs">
                  <span className="text-label-md font-label-md font-bold text-on-surface">$49.99</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">12 Hours</span>
                </div>
              </div>
            </div>
          </div>
          {/* Course Card 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-200 flex flex-col cursor-pointer group">
            <div className="h-32 bg-surface-container relative w-full overflow-hidden">
              <img alt="Neural network graphic" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ4fKmtn5ewbt0HqxW1DinysFDRxXu5yUacA-SSi19M6iq4zCFSgu-fBb1TAqDzu45ORjTkfnRgnGf8rcyn5fylk8cA8FHV3OrPFbGowV2_p8TBmBTQokvVvNtrlxgjDuorWDYvjGh-fhNKmfSs4G7g-VAzIot0P4QaYF9H1-_dIHX-fj5Atx-7wVj6mTBbuNSdx6WSAAARIm-Dcl0GwWoxzgH4NrQ0T41jwNtnjmW3xLMW-qksTO_c9Myc9o8kWG-NIRcqHR_w80H"/>
              <div className="absolute top-sm left-sm bg-secondary text-on-secondary px-xs py-[2px] rounded text-[10px] font-label-sm font-bold uppercase tracking-wider">
                NEW
              </div>
            </div>
            <div className="p-sm flex flex-col flex-1">
              <h3 className="text-label-md font-label-md font-bold text-on-surface mb-xs leading-snug group-hover:text-primary transition-colors line-clamp-2">Foundations of Neural Networks</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-sm">Prof. Alan Turing</p>
              <div className="mt-auto">
                <div className="flex items-center gap-xs mb-xs">
                  <span className="text-label-sm font-label-sm font-bold text-[#F59E0B]">4.9</span>
                  <span className="material-symbols-outlined text-[14px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">(850 students)</span>
                </div>
                <div className="flex items-center justify-between border-t border-outline-variant pt-xs mt-xs">
                  <span className="text-label-md font-label-md font-bold text-on-surface">$59.99</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">8 Hours</span>
                </div>
              </div>
            </div>
          </div>
          {/* Course Card 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-200 flex flex-col cursor-pointer group">
            <div className="h-32 bg-surface-container relative w-full overflow-hidden">
              <img alt="Data analytics graphs" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUMIDARBuZTxXUqj6xEfCZTHkjPHxHdIO2ZcvBj5VeeAu_-RQUeoF6xnRDJKX9Qd6n1NtwA2n8uIZUfFIJIxQfHeZwW2qy7Tzd_wfetoqSgwjD_taOXK347KN918BxyAw9teFp6tLKkFQQFWikoh970Fkz-6GKaMzDIJUMwHtYGHIAQ9SBFNuPO5TgjZ6AWcq_C7oK1bSMYd6qGw0LPB-n-Pb4jdXGPGlTrqc5q3ptdujtPCt7kRZDl5TcvMB3ZrscZF5dClpyi97R"/>
              <div className="absolute top-sm left-sm bg-surface text-on-surface border border-outline-variant px-xs py-[2px] rounded text-[10px] font-label-sm font-bold uppercase tracking-wider">
                BESTSELLER
              </div>
            </div>
            <div className="p-sm flex flex-col flex-1">
              <h3 className="text-label-md font-label-md font-bold text-on-surface mb-xs leading-snug group-hover:text-primary transition-colors line-clamp-2">Advanced Data Analytics with Python</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-sm">Elena Rodriguez</p>
              <div className="mt-auto">
                <div className="flex items-center gap-xs mb-xs">
                  <span className="text-label-sm font-label-sm font-bold text-[#F59E0B]">4.7</span>
                  <span className="material-symbols-outlined text-[14px] text-[#F59E0B]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">(3.4k students)</span>
                </div>
                <div className="flex items-center justify-between border-t border-outline-variant pt-xs mt-xs">
                  <span className="text-label-md font-label-md font-bold text-on-surface">$29.99</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">5.5 Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
