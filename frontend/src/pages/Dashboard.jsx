
import { AlertTriangle, TrendingUp, Play } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Top 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white shadow-sm border border-transparent">
          <h2 className="text-[32px] font-semibold leading-[40px] tracking-[-0.02em] mb-2">Welcome back, Alex.</h2>
          <p className="text-[18px] opacity-90 mb-6">Your AI roadmap has been updated. Resume where you left off.</p>
          <button className="px-4 py-2 border border-white rounded-md font-medium hover:bg-white hover:text-primary transition-colors">
            Continue Learning →
          </button>
        </div>

        {/* Critical Gap Card */}
        <div className="bg-surface rounded-lg p-6 border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center text-error mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-[12px] font-medium tracking-[0.02em] uppercase">Critical Gap Detected</span>
            </div>
            <h3 className="text-[20px] font-semibold text-text-primary mb-2">Probability Basics</h3>
            <p className="text-[16px] text-text-secondary">Recent quiz shows 34% drop. Address before proceeding.</p>
          </div>
          <div className="mt-4">
            <button className="px-4 py-2 border border-primary text-primary rounded-md font-medium hover:bg-surface-low transition-colors">
              Review Now
            </button>
          </div>
        </div>
      </div>

      {/* Middle 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Knowledge State Card (Placeholder for Radar Chart) */}
        <div className="bg-surface rounded-lg p-6 border border-border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[20px] font-semibold text-text-primary">Knowledge State</h3>
            <button className="text-text-muted hover:text-text-primary">...</button>
          </div>
          <div className="h-64 flex items-center justify-center bg-surface-low rounded border border-dashed border-border">
            <p className="text-text-muted">Radar Chart Placeholder</p>
          </div>
        </div>

        {/* Skill Progress */}
        <div className="bg-surface rounded-lg p-6 border border-border shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-[12px] font-medium tracking-[0.02em] uppercase text-text-muted mb-4">Skill Progress</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">Algorithm</span>
                <span className="text-sm font-medium text-primary">78%</span>
              </div>
              <div className="w-full bg-surface-low rounded-full h-2 mb-4">
                <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">Data Structures</span>
                <span className="text-sm font-medium text-secondary">91%</span>
              </div>
              <div className="w-full bg-surface-low rounded-full h-2 mb-4">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border flex items-center text-text-secondary">
            <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
            <span className="font-medium text-sm">Current Streak / 12 Days</span>
          </div>
        </div>
      </div>

      {/* Active Curriculum */}
      <div>
        <h3 className="text-[20px] font-semibold text-text-primary mb-4">Active Curriculum</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
            <div className="h-32 bg-surface-low flex items-center justify-center relative">
               <span className="absolute top-2 left-2 bg-error text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Required</span>
               <Play className="h-8 w-8 text-text-muted opacity-50" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-text-primary text-sm mb-1 line-clamp-2">Advanced Graph Theory</h4>
                <p className="text-xs text-text-muted">Dr. Sarah Chen</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
                <span>12k students</span>
                <span className="text-primary font-medium">Continue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
