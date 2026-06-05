import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

const Leaderboard = () => {
  const { user } = useAuthStore();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/gamification/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        console.error("Liderlik tablosu yüklenemedi", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Current user's rank
  const myRank = leaders.find(l => l.id === user?.id)?.rank;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                <span className="material-symbols-outlined text-yellow-400 text-sm">emoji_events</span>
                <span className="text-white/80 text-xs font-semibold">Haftalık Liderlik Tablosu</span>
              </div>
              <h1 className="text-3xl font-black text-white mb-2">En İyiler Arasına Girin</h1>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                Eğitimleri tamamlayarak ve sınavları geçerek XP kazanın. Üst sıralara tırmanıp rozetlerinizi sergileyin!
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-6 shrink-0 backdrop-blur-md">
              <div className="text-center">
                <p className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Benim Sıram</p>
                <p className="text-white text-3xl font-black">{myRank ? `#${myRank}` : '-'}</p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <p className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Toplam XP</p>
                <p className="text-yellow-400 text-3xl font-black">{user?.xp || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 */}
        {leaders.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 items-end mb-8 pt-8">
            {/* Rank 2 */}
            <div className="bg-[#1E293B] border border-white/10 rounded-t-2xl p-4 flex flex-col items-center relative" style={{ height: '160px' }}>
              <div className="absolute -top-6 w-12 h-12 rounded-full border-4 border-[#1E293B] bg-slate-400 text-[#1E293B] flex items-center justify-center font-black text-xl shadow-lg z-10">2</div>
              <div className="mt-8 text-center">
                <p className="text-white font-bold truncate max-w-[120px]">{leaders[1].name}</p>
                <p className="text-yellow-400 font-black mt-1">{leaders[1].xp} XP</p>
              </div>
            </div>
            {/* Rank 1 */}
            <div className="bg-gradient-to-t from-yellow-500/20 to-[#1E293B] border border-yellow-500/30 rounded-t-2xl p-4 flex flex-col items-center relative" style={{ height: '200px' }}>
              <div className="absolute -top-8 w-16 h-16 rounded-full border-4 border-[#0F172A] bg-yellow-400 text-yellow-900 flex items-center justify-center font-black text-3xl shadow-xl shadow-yellow-500/20 z-10">1</div>
              <span className="material-symbols-outlined absolute -top-14 text-yellow-400 text-3xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">workspace_premium</span>
              <div className="mt-10 text-center">
                <p className="text-white font-bold text-lg truncate max-w-[140px]">{leaders[0].name}</p>
                <p className="text-yellow-400 font-black text-xl mt-1">{leaders[0].xp} XP</p>
              </div>
            </div>
            {/* Rank 3 */}
            <div className="bg-[#1E293B] border border-white/10 rounded-t-2xl p-4 flex flex-col items-center relative" style={{ height: '140px' }}>
              <div className="absolute -top-6 w-12 h-12 rounded-full border-4 border-[#1E293B] bg-amber-600 text-white flex items-center justify-center font-black text-xl shadow-lg z-10">3</div>
              <div className="mt-8 text-center">
                <p className="text-white font-bold truncate max-w-[120px]">{leaders[2].name}</p>
                <p className="text-yellow-400 font-black mt-1">{leaders[2].xp} XP</p>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
          {leaders.map((leader, index) => {
            const isMe = leader.id === user?.id;
            return (
              <div key={leader.id} className={`flex items-center gap-4 p-4 border-b border-white/5 transition-colors ${isMe ? 'bg-primary/10 border-primary/20' : 'hover:bg-white/5'}`}>
                <div className="w-10 text-center">
                  {index === 0 ? <span className="material-symbols-outlined text-yellow-400">workspace_premium</span> : 
                   index === 1 ? <span className="material-symbols-outlined text-slate-400">workspace_premium</span> : 
                   index === 2 ? <span className="material-symbols-outlined text-amber-600">workspace_premium</span> : 
                   <span className="text-slate-500 font-bold">{index + 1}</span>}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
                  {leader.avatar_url ? (
                    <img src={leader.avatar_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${leader.avatar_url}` : leader.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    leader.name[0].toUpperCase()
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold truncate ${isMe ? 'text-primary' : 'text-white'}`}>
                      {leader.name}
                    </p>
                    {isMe && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-md font-bold">SEN</span>}
                  </div>
                  {leader.badges && leader.badges.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {leader.badges.map((b, i) => (
                        <span key={i} className={`material-symbols-outlined text-[14px] ${b.color || 'text-slate-400'}`} title={b.name}>{b.icon}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-orange-500 text-[16px]">local_fire_department</span>
                      <span className="text-slate-300 font-bold text-sm">{leader.streak_days}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Seri</span>
                  </div>
                  <div className="flex flex-col items-end w-20">
                    <span className="text-yellow-400 font-black text-lg">{leader.xp}</span>
                    <span className="text-slate-500 text-[10px]">XP</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {leaders.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              Henüz kimse XP kazanmadı. İlk sıralara yerleşmek için eğitimlere başlayın!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
