import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const statusConfig = {
  completed: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/40',
    iconBg: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    badgeText: '✓ Tamamlandı',
    lineColor: 'bg-emerald-500',
  },
  active: {
    bg: 'bg-primary/10',
    border: 'border-primary/50',
    iconBg: 'bg-primary',
    badge: 'bg-primary/10 text-primary border-primary/20',
    badgeText: '▶ Devam Ediyor',
    lineColor: 'bg-primary',
  },
  gap: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    iconBg: 'bg-red-500',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    badgeText: '⚠ Bilgi Boşluğu',
    lineColor: 'bg-red-500',
  },
  locked: {
    bg: 'bg-white/5',
    border: 'border-white/10',
    iconBg: 'bg-slate-600',
    badge: 'bg-white/5 text-slate-500 border-white/10',
    badgeText: '🔒 Kilitli',
    lineColor: 'bg-slate-700',
  },
};

const MasteryBar = ({ percent, status }) => {
  const colors = {
    completed: 'bg-emerald-500',
    active: 'bg-primary',
    gap: 'bg-red-500',
    locked: 'bg-slate-600',
  };
  return (
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${colors[status]}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

const LearningRoadmap = () => {
  const navigate = useNavigate();

  const { data: nodes = [], isLoading } = useQuery({
    queryKey: ['activeRoadmap'],
    queryFn: async () => {
      const res = await api.get('/roadmap/dashboard/active');
      return res.data.nodes || [];
    }
  });

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes.find(n => n.status === 'active') || nodes[0] || null;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completedCount = nodes.filter(n => n.status === 'completed').length;
  const totalCount = nodes.length;
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      
      {/* Page Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Öğrenme Yol Haritam</h1>
            <p className="text-slate-400 text-sm mt-1">
              Yapay zeka tarafından senin için kişiselleştirildi • {completedCount}/{totalCount} modül tamamlandı
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Overall Progress */}
            <div className="flex items-center gap-3 bg-[#1E293B] px-4 py-2.5 rounded-xl border border-white/10">
              <div className="w-10 h-10 relative flex items-center justify-center">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#ffffff10" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke="#1A56DB" strokeWidth="3"
                    strokeDasharray={`${overallProgress * 0.94} 94`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-white">{overallProgress}%</span>
              </div>
              <div>
                <p className="text-white text-sm font-bold">Genel İlerleme</p>
                <p className="text-slate-400 text-xs">{completedCount} tamamlandı</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/assessment/diagnostic')}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all text-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">quiz</span>
              Seviye Tespit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {nodes.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">route</span>
                <p className="text-slate-400">Henüz aktif bir yol haritanız bulunmuyor.</p>
                <button onClick={() => navigate('/courses')} className="mt-4 text-primary hover:underline">Eğitimleri Keşfet</button>
              </div>
            ) : (
              nodes.map((node, idx) => {
              const cfg = statusConfig[node.status];
              const isSelected = selectedNode?.id === node.id;
              const isLast = idx === nodes.length - 1;

              return (
                <div key={node.id} className="flex gap-4">
                  {/* Timeline Connector */}
                  <div className="flex flex-col items-center shrink-0">
                    {/* Icon Circle */}
                    <button
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-12 h-12 rounded-full ${cfg.iconBg} flex items-center justify-center shrink-0 shadow-lg transition-all duration-200 ${
                        isSelected ? 'ring-4 ring-white/20 scale-110' : 'hover:scale-105'
                      } ${node.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="material-symbols-outlined text-white text-[22px]">
                        {node.status === 'locked' ? 'lock' : node.status === 'completed' ? 'check' : node.icon}
                      </span>
                    </button>
                    {/* Connector Line */}
                    {!isLast && (
                      <div className={`w-0.5 flex-1 my-2 min-h-[24px] rounded-full ${cfg.lineColor} ${node.status === 'locked' ? 'opacity-20' : ''}`} />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 mb-4 rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${cfg.bg} ${cfg.border} ${
                    isSelected ? 'shadow-xl scale-[1.01]' : 'hover:scale-[1.005] hover:brightness-110'
                  } ${node.status === 'locked' ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={() => node.status !== 'locked' && setSelectedNodeId(node.id)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cfg.badge}`}>
                            {cfg.badgeText}
                          </span>
                          <span className="text-slate-500 text-[10px] font-medium">{node.category}</span>
                        </div>
                        <h3 className={`text-lg font-bold ${node.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                          {node.title}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-2xl font-black ${
                          node.status === 'completed' ? 'text-emerald-400' :
                          node.status === 'active' ? 'text-primary' :
                          node.status === 'gap' ? 'text-red-400' : 'text-slate-600'
                        }`}>{node.mastery}%</p>
                        <p className="text-slate-500 text-[10px]">Hakimiyet</p>
                      </div>
                    </div>

                    <p className={`text-sm mb-3 leading-relaxed ${node.status === 'locked' ? 'text-slate-600' : 'text-slate-400'}`}>
                      {node.description}
                    </p>

                    {/* Mastery Bar */}
                    <MasteryBar percent={node.mastery} status={node.status} />

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {node.estimatedTime}
                      </span>
                      {node.status === 'active' && (
                        <button
                          onClick={e => { e.stopPropagation(); navigate('/courses'); }}
                          className="text-primary text-xs font-bold hover:text-indigo-300 transition-colors flex items-center gap-1"
                        >
                          Devam Et
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      )}
                      {node.status === 'gap' && (
                        <button
                          onClick={e => { e.stopPropagation(); navigate('/assessment/diagnostic'); }}
                          className="text-red-400 text-xs font-bold hover:text-red-300 transition-colors flex items-center gap-1"
                        >
                          Değerlendir
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      )}
                      {node.status === 'locked' && (
                        <span className="text-slate-600 text-xs">{node.prerequisite}</span>
                      )}
                    </div>

                    {/* AI Insight or Gap Warning */}
                    {node.aiInsight && (
                      <div className="mt-3 pt-3 border-t border-primary/20 flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">psychology</span>
                        <p className="text-primary/80 text-xs leading-relaxed">{node.aiInsight}</p>
                      </div>
                    )}
                    {node.gapReason && (
                      <div className="mt-3 pt-3 border-t border-red-500/20 flex items-start gap-2">
                        <span className="material-symbols-outlined text-red-400 text-[16px] mt-0.5 shrink-0">warning</span>
                        <p className="text-red-400/80 text-xs leading-relaxed">{node.gapReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* Right Detail Panel */}
        {selectedNode && (
          <aside className="w-80 bg-[#0F172A] border-l border-white/5 flex flex-col overflow-y-auto shrink-0">
            <div className="p-5 border-b border-white/5">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Seçili Modül</p>
              <div className={`w-14 h-14 rounded-2xl ${statusConfig[selectedNode.status].iconBg} flex items-center justify-center mb-3 shadow-lg`}>
                <span className="material-symbols-outlined text-white text-2xl">{selectedNode.icon}</span>
              </div>
              <h2 className="text-white font-black text-xl mb-1">{selectedNode.title}</h2>
              <span className={`text-xs font-bold px-2 py-1 rounded-md border ${statusConfig[selectedNode.status].badge}`}>
                {statusConfig[selectedNode.status].badgeText}
              </span>
            </div>

            <div className="p-5 space-y-5 flex-1">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1E293B] rounded-xl p-3 text-center border border-white/5">
                  <p className={`text-2xl font-black ${
                    selectedNode.status === 'completed' ? 'text-emerald-400' :
                    selectedNode.status === 'active' ? 'text-primary' :
                    selectedNode.status === 'gap' ? 'text-red-400' : 'text-slate-600'
                  }`}>{selectedNode.mastery}%</p>
                  <p className="text-slate-500 text-[10px] mt-1">Hakimiyet</p>
                </div>
                <div className="bg-[#1E293B] rounded-xl p-3 text-center border border-white/5">
                  <p className="text-white font-black text-sm mt-1">{selectedNode.estimatedTime}</p>
                  <p className="text-slate-500 text-[10px] mt-1">Süre</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Açıklama</p>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedNode.description}</p>
              </div>

              {/* AI Insight */}
              {selectedNode.aiInsight && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                    <p className="text-primary text-xs font-bold">AI Önerisi</p>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{selectedNode.aiInsight}</p>
                </div>
              )}

              {/* Gap Warning */}
              {selectedNode.gapReason && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-red-400 text-[18px]">warning</span>
                    <p className="text-red-400 text-xs font-bold">Dikkat</p>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{selectedNode.gapReason}</p>
                </div>
              )}

              {/* Prerequisite */}
              {selectedNode.prerequisite && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">lock</span>
                    <p className="text-slate-400 text-xs font-bold">Ön Koşul</p>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{selectedNode.prerequisite}</p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-5 border-t border-white/5">
              {selectedNode.status === 'active' && (
                <button
                  onClick={() => navigate('/courses')}
                  className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  Öğrenmeye Devam Et
                </button>
              )}
              {selectedNode.status === 'gap' && (
                <button
                  onClick={() => navigate('/assessment/diagnostic')}
                  className="w-full bg-red-500/20 text-red-400 border border-red-500/30 py-3 rounded-xl font-bold hover:bg-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">quiz</span>
                  Boşluğu Değerlendir
                </button>
              )}
              {selectedNode.status === 'completed' && (
                <button
                  onClick={() => navigate('/courses')}
                  className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-3 rounded-xl font-bold hover:bg-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">replay</span>
                  Tekrar Gözden Geçir
                </button>
              )}
              {selectedNode.status === 'locked' && (
                <button
                  disabled
                  className="w-full bg-white/5 text-slate-600 border border-white/5 py-3 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Ön Koşulları Tamamla
                </button>
              )}
            </div>
          </aside>
        )}

      </div>
    </div>
  );
};

export default LearningRoadmap;
