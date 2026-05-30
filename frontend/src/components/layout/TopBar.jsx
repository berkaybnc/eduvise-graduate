import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const TopBar = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isInstructor = user?.role === 'instructor';

  return (
    <header className="bg-[#0F172A]/95 backdrop-blur-xl h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
      {/* Search */}
      <div className="flex-1 flex items-center max-w-md">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 text-sm text-white transition-all"
            placeholder="Kurs, konu veya eğitmen ara..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0F172A]" />
        </button>

        {/* AI Quick Action */}
        <button
          onClick={() => navigate(isInstructor ? '/instructor/courses' : '/assessment/diagnostic')}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isInstructor ? 'add_circle' : 'psychology'}
          </span>
          {isInstructor ? 'Yeni Kurs' : 'AI Değerlendirme'}
        </button>

        {/* Role Badge */}
        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
          isInstructor
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-primary/10 text-primary border-primary/20'
        }`}>
          {isInstructor ? '👨‍🏫 Eğitmen' : '👨‍🎓 Öğrenci'}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {user?.full_name ? user.full_name[0].toUpperCase() : 'E'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
