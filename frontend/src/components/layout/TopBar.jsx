import { Search, Bell, Sparkles, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const TopBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-surface h-16 border-b border-border flex items-center justify-between px-6">
      <div className="flex-1 flex items-center">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background placeholder-text-muted focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
            placeholder="Search knowledge base..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-text-muted hover:text-text-primary relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error ring-2 ring-surface"></span>
        </button>
        <button className="text-secondary hover:text-secondary-container">
          <Sparkles className="h-5 w-5" />
        </button>
        <button className="text-text-muted hover:text-text-primary">
          <Settings className="h-5 w-5" />
        </button>
        
        <div className="h-6 w-px bg-border mx-2"></div>
        
        <button 
          onClick={() => navigate('/assessment/diagnostic')}
          className="bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
        >
          + New Goal
        </button>
        
        <div className="ml-4 flex items-center gap-3">
          <span className="text-sm font-medium text-text-primary">{user?.full_name || 'Kullanıcı'}</span>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
          </div>
          <button onClick={handleLogout} className="text-text-muted hover:text-error ml-2" title="Çıkış Yap">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
