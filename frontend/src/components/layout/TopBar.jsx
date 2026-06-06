import { useState, useEffect, useRef } from 'react';
import { Search, Bell, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

const TopBar = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const isInstructor = user?.role === 'instructor';
  
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch initial notifications
  useEffect(() => {
    if (!token) return;
    
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications/');
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, [token]);

  // WebSocket Connection
  useEffect(() => {
    if (!token) return;
    
    // Create WebSocket connection
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const wsBaseUrl = baseUrl.replace(/^http/, 'ws');
    const wsUrl = `${wsBaseUrl}/notifications/ws?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Prepend the new notification
      setNotifications(prev => [data, ...prev]);
    };

    return () => {
      ws.close();
    };
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-[#0F172A]/95 backdrop-blur-xl h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 relative z-50">
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
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`relative p-2 rounded-xl transition-all border ${showDropdown ? 'bg-white/10 border-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10 border-transparent hover:border-white/10'}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#0F172A]" />
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1E293B] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[400px]">
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <h3 className="text-white font-bold text-sm">Bildirimler</h3>
                {unreadCount > 0 && (
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} Yeni
                  </span>
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    Henüz bildiriminiz yok.
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => markAsRead(notif.id, notif.is_read)}
                      className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex gap-3 ${!notif.is_read ? 'bg-white/[0.02]' : 'opacity-70'}`}
                    >
                      <div className={`mt-0.5 shrink-0 ${!notif.is_read ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {!notif.is_read ? <Circle className="h-2 w-2 fill-emerald-400" /> : <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className={`text-sm ${!notif.is_read ? 'text-white font-semibold' : 'text-slate-300'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-2">
                          {new Date(notif.created_at).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Gamification Stats (Only for Students) */}
        {!isInstructor && (
          <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl mr-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-500 text-[18px]">local_fire_department</span>
              <span className="text-white font-bold text-sm">{user?.streak_days || 0}</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-yellow-400 text-[18px]">stars</span>
              <span className="text-white font-bold text-sm">{user?.xp || 0} XP</span>
            </div>
          </div>
        )}

        {/* AI Quick Action */}
        <button
          onClick={() => navigate(isInstructor ? '/instructor/courses' : '/assessment/diagnostic', { state: { openCreateTab: isInstructor } })}
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
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${user.avatar_url}` : user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.full_name ? user.full_name[0].toUpperCase() : 'E'
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
