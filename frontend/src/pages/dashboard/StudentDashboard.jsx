import React from 'react';

export const Dashboard = () => {
  return (
    <div className="p-lg h-full overflow-y-auto w-full relative">
      <div className="max-w-7xl mx-auto space-y-lg pb-xl">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Left Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#1A56DB] to-[#003fb1] rounded-xl p-lg relative overflow-hidden text-on-primary">
            <div className="relative z-10">
              <h2 className="font-headline-lg text-headline-lg mb-sm">Welcome back, Alex.</h2>
              <p className="font-body-md text-body-md opacity-90 max-w-md mb-md">
                Your AI roadmap has been updated. Resume where you left off.
              </p>
              <button className="bg-surface-container-lowest text-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface transition-colors flex items-center gap-2">
                <span>Continue Learning</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            {/* Decorative elements */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mb-10"></div>
          </div>
          {/* Right Card (Alert) */}
          <div className="bg-surface-container-lowest border-2 border-secondary/30 rounded-xl p-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-secondary mb-3">
                <span>⚡</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Critical Gap Detected</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Probability Basics</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Recent quiz shows 34% drop. Address before proceeding.
              </p>
            </div>
            <button className="mt-4 w-full border border-secondary text-secondary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-secondary/5 transition-colors">
              Review Now
            </button>
          </div>
        </div>
        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Left Card: Knowledge State Radar */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col h-[400px]">
            <div className="border-b border-outline-variant/50 pb-sm mb-md flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-on-surface">Knowledge State</h3>
              <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div className="flex-1 relative flex items-center justify-center">
              {/* Hexagonal Radar Chart CSS */}
              <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Concentric Hexagons */}
                <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100">
                  <polygon fill="none" points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" stroke="currentColor" strokeWidth="0.5"></polygon>
                  <polygon fill="none" points="50,20 76.5,35 76.5,65 50,80 23.5,65 23.5,35" stroke="currentColor" strokeWidth="0.5"></polygon>
                  <polygon fill="none" points="50,35 63,42.5 63,57.5 50,65 37,57.5 37,42.5" stroke="currentColor" strokeWidth="0.5"></polygon>
                  {/* Axes */}
                  <line stroke="currentColor" strokeWidth="0.5" x1="50" x2="50" y1="5" y2="95"></line>
                  <line stroke="currentColor" strokeWidth="0.5" x1="10" x2="90" y1="27.5" y2="72.5"></line>
                  <line stroke="currentColor" strokeWidth="0.5" x1="10" x2="90" y1="72.5" y2="27.5"></line>
                </svg>
                {/* Data Polygon */}
                <svg className="absolute w-full h-full opacity-80" viewBox="0 0 100 100">
                  <polygon fill="rgba(26, 86, 219, 0.2)" points="50,15 82,32 78,65 50,85 30,68 25,35" stroke="#1A56DB" strokeWidth="1.5"></polygon>
                </svg>
                {/* Labels */}
                <span className="absolute top-[-5px] font-label-sm text-label-sm text-on-surface">Algorithm</span>
                <span className="absolute right-[-10px] top-[20%] font-label-sm text-label-sm text-on-surface">Data Structs</span>
                <span className="absolute right-[-10px] bottom-[20%] font-label-sm text-label-sm text-on-surface">Backend</span>
                <span className="absolute bottom-[-15px] font-label-sm text-label-sm text-on-surface">Frontend</span>
                <span className="absolute left-[-5px] bottom-[20%] font-label-sm text-label-sm text-on-surface">Testing</span>
                <span className="absolute left-[-15px] top-[20%] font-label-sm text-label-sm text-on-surface">Sys Design</span>
              </div>
            </div>
          </div>
          {/* Right Column: Progress & Streak */}
          <div className="flex flex-col gap-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex-1">
              <h3 className="font-label-md text-label-md text-on-surface-variant font-medium mb-4 uppercase tracking-wider">Skill Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface">Algorithm</span>
                    <span className="text-on-surface-variant">78%</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{width: "78%"}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface">Data Structures</span>
                    <span className="text-on-surface-variant">91%</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{width: "91%"}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface">Backend</span>
                    <span className="text-on-surface-variant">45%</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{width: "45%"}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface">Frontend</span>
                    <span className="text-on-surface-variant">62%</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{width: "62%"}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xl">
                  🔥
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Current Streak</p>
                  <p className="font-headline-md text-headline-md text-on-surface">12 Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Section: Active Curriculum */}
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Active Curriculum</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {/* Course Card 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer flex flex-col group">
              <div className="h-32 bg-surface-variant relative">
                <img alt="Course cover" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyY84G2D2cs8gBNSrnHjXrFUSA6NOti9RuuVqeSZkIoFUlnLh6dwH3HVdBQvMwi0PrI4y32zAZ8LYPnJJGdGbzVILDiorZrpZHXc1H-uePlSPTdvINh1jmyo--fNqgBRtxXaQC4j0JfZzyqTeTPN67xo_JoVdjxS3dM8LiYggAS2YXRsHsn2RT1XX_3nhUAuWORyDVFB0EUWCqYGu_kF2BtN0A_grAo4ZXEc-hduldUvNEurZzZem5iGRUYbuwqhoe-fldumadjGiS"/>
                <div className="absolute top-3 left-3 px-2 py-1 bg-surface-container-lowest rounded text-[10px] font-bold text-error tracking-wider uppercase shadow-sm">
                  REQUIRED
                </div>
              </div>
              <div className="p-md flex-1 flex flex-col">
                <h4 className="font-body-md text-body-md text-on-surface font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">Advanced Graph Theory</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Dr. Sarah Chen</p>
                <div className="mt-auto flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant border-t border-outline-variant/30 pt-3">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    <span>1,240 enrolled</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Course Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer flex flex-col group">
              <div className="h-32 bg-surface-variant relative">
                <img alt="Course cover" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB081B2mucSp4tcNXpeBk_QbvUG6Y9x9sXgTG1TxDIhadtZ4qqyx9nQ_ikimaRjxg6SM4D7Cc-VNZZrjkbB10-VNSrgtyB5y9BEEo_lUSOT9VR45-kSnSt-oDvhy9lKgKnQCGYeHs715vAIssVAU6y-ORUzOipVpEUE6OjdYAaJM1Qri7S81FY1EPyjdjhj1SmJQXoZTtlSvXgyGClYOTtQ8zw94qz5y5moNzWQf9KeDuaNusFrks6O6bME6JioYWEZxvbNK0dxCOC6"/>
                <div className="absolute top-3 left-3 px-2 py-1 bg-surface-container-lowest rounded text-[10px] font-bold text-primary tracking-wider uppercase shadow-sm">
                  TRENDING
                </div>
              </div>
              <div className="p-md flex-1 flex flex-col">
                <h4 className="font-body-md text-body-md text-on-surface font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">System Design Masterclass</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Marcus Reed</p>
                <div className="mt-auto flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant border-t border-outline-variant/30 pt-3">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    <span>8,902 enrolled</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Course Card 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer flex flex-col group">
              <div className="h-32 bg-surface-variant relative">
                <img alt="Course cover" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYqVvaGvvAQvX43bPscjJ3rxxgLAYuc-CHtpNsRkVJnCDKb16do80HFOaKpevSfAF6nM8L-7vbInVtqCKJzlK0Z48a-k9BLAKUapOCMKhncVJDpUDtqP3oyrjPcIjmJVisdyykv0tlHLGI-kFtf8VLpTvz7ybiov8DCto_oZ8WS6XUldVG71_dh1bHMsdijRKhqCarXEFtHXRzOnwlriIrdn2nG2mq1pBNJu5CtQoT81MptWTpIDdYPnsqafCuOrAzyaAS4HigxUQC"/>
                <div className="absolute top-3 left-3 px-2 py-1 bg-surface-container-lowest rounded text-[10px] font-bold text-secondary tracking-wider uppercase shadow-sm">
                  ELECTIVE
                </div>
              </div>
              <div className="p-md flex-1 flex flex-col">
                <h4 className="font-body-md text-body-md text-on-surface font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">Introduction to Cryptography</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Prof. Alan Turing</p>
                <div className="mt-auto flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant border-t border-outline-variant/30 pt-3">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    <span>456 enrolled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
