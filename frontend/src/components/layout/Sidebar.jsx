import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const studentNav = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { name: 'Öğrenme Yolu', path: '/roadmap', icon: 'map' },
  { name: 'Eğitimler', path: '/courses', icon: 'school' },
  { name: 'Raporlarım', path: '/reports', icon: 'bar_chart' },
  { name: 'Liderlik Tablosu', path: '/leaderboard', icon: 'emoji_events' },
  { name: 'Değerlendirme', path: '/assessment/diagnostic', icon: 'quiz' },
];

const instructorNav = [
  { name: 'Analiz & Gelir', path: '/instructor/dashboard', icon: 'bar_chart' },
  { name: 'Kurs Yöneticisi', path: '/instructor/courses', icon: 'video_library' },
  { name: 'Profil Ayarları', path: '/instructor/settings', icon: 'person' },
];

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isInstructor = user?.role === 'instructor';
  const navItems = isInstructor ? instructorNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'EV';

  return (
    <div className="w-[260px] bg-[#0F172A] flex flex-col h-full border-r border-white/5 relative overflow-hidden">
      {/* Dekoratif Işık */}
      <div className="absolute top-0 left-0 w-full h-40 bg-primary/5 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="px-6 pt-6 pb-4 relative z-10">
        <div className="flex flex-col items-start gap-1">
          <img src="/logo.png" alt="EduVise Logo" className="h-10 object-contain drop-shadow-lg" />
          <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold ml-1">
            {isInstructor ? 'Eğitmen Paneli' : 'AI Adaptive Learning'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 relative z-10 overflow-y-auto">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">
          {isInstructor ? 'Eğitmen' : 'Öğrenci'} Menüsü
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-primary/20 text-white border border-primary/30 shadow-lg shadow-primary/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.icon}
                </span>
                {item.name}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/5 relative z-10" />

      {/* User Card */}
      <div className="p-4 relative z-10">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${user.avatar_url}` : user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.full_name || 'Kullanıcı'}</p>
            <p className="text-slate-500 text-xs capitalize">{user?.role === 'instructor' ? 'Eğitmen' : 'Öğrenci'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold border border-transparent hover:border-red-500/20"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
