import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';

const CourseForum = ({ courseId }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['forum', courseId],
    queryFn: async () => {
      const res = await api.get(`/forum/${courseId}`);
      return res.data;
    }
  });

  const { data: topicDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['forumTopic', selectedTopic?.id],
    queryFn: async () => {
      if (!selectedTopic) return null;
      const res = await api.get(`/forum/topics/${selectedTopic.id}`);
      return res.data;
    },
    enabled: !!selectedTopic,
    refetchInterval: 3000 // Poll for AI reply
  });

  const createTopic = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/forum/${courseId}`, {
        title: newTitle,
        content: newContent
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['forum', courseId]);
      setShowNewTopic(false);
      setNewTitle('');
      setNewContent('');
    }
  });

  const createReply = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/forum/topics/${selectedTopic.id}/reply`, {
        content: replyContent
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['forumTopic', selectedTopic.id]);
      setReplyContent('');
    }
  });

  const resolveTopic = useMutation({
    mutationFn: async (id) => {
      await api.put(`/forum/topics/${id}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['forumTopic', selectedTopic?.id]);
      queryClient.invalidateQueries(['forum', courseId]);
    }
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400">Yükleniyor...</div>;
  }

  // Topic Details View
  if (selectedTopic) {
    const details = topicDetails || selectedTopic;
    return (
      <div className="bg-[#1E293B] border border-white/10 rounded-3xl p-6">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Geri Dön
        </button>
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white overflow-hidden shrink-0">
              {details.user?.avatar_url ? (
                <img src={details.user.avatar_url.startsWith('/uploads') ? `http://localhost:8000${details.user.avatar_url}` : details.user.avatar_url} alt="" className="w-full h-full object-cover"/>
              ) : (
                details.user?.full_name?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <p className="font-bold text-white text-sm">{details.user?.full_name}</p>
              <p className="text-xs text-slate-500">{new Date(details.created_at).toLocaleString('tr-TR')}</p>
            </div>
            {details.is_resolved && (
              <span className="ml-auto px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">Çözüldü</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{details.title}</h3>
          <p className="text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl">{details.content}</p>
          
          {!details.is_resolved && (details.user_id === user?.id || user?.role === 'instructor') && (
            <button 
              onClick={() => resolveTopic.mutate(details.id)}
              className="mt-4 px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold rounded-lg transition-colors text-sm"
            >
              Sorunu Çözüldü İşaretle
            </button>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <h4 className="font-bold text-white border-b border-white/10 pb-2">Cevaplar ({details.replies?.length || 0})</h4>
          {loadingDetails && !details.replies ? (
            <div className="text-slate-500">Yanıtlar yükleniyor...</div>
          ) : (
            details.replies?.map((reply) => (
              <div key={reply.id} className={`flex gap-4 p-4 rounded-xl ${reply.is_ai ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-white/5'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${reply.is_ai ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}>
                  {reply.is_ai ? (
                    <span className="material-symbols-outlined">smart_toy</span>
                  ) : (
                    reply.user?.avatar_url ? (
                      <img src={reply.user.avatar_url.startsWith('/uploads') ? `http://localhost:8000${reply.user.avatar_url}` : reply.user.avatar_url} alt="" className="w-full h-full object-cover rounded-full"/>
                    ) : (
                      reply.user?.full_name?.[0]?.toUpperCase()
                    )
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-white">{reply.is_ai ? 'EduVise AI' : reply.user?.full_name}</span>
                    <span className="text-xs text-slate-500">{new Date(reply.created_at).toLocaleString('tr-TR')}</span>
                    {reply.is_ai && <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold">YAPAY ZEKA</span>}
                  </div>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {!details.is_resolved && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Cevabınızı yazın..."
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:border-primary/50 focus:outline-none min-h-[100px]"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => createReply.mutate()}
                  disabled={!replyContent.trim() || createReply.isPending}
                  className="px-6 py-2 bg-primary hover:bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-50 transition-colors"
                >
                  Yanıtla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Topic List View
  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">forum</span>
          Topluluk Soru & Cevap
        </h3>
        <button 
          onClick={() => setShowNewTopic(!showNewTopic)}
          className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">{showNewTopic ? 'close' : 'add'}</span>
          {showNewTopic ? 'İptal' : 'Yeni Soru Sor'}
        </button>
      </div>

      {showNewTopic && (
        <div className="p-6 bg-white/[0.02] border-b border-white/10">
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2">Başlık</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Sorunuzun kısa bir özeti..."
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2">Detay</label>
              <textarea 
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Yaşadığınız problemi veya sorunuzu detaylıca anlatın. (AI Asistanımız hemen yanıtlayacaktır!)"
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl p-4 text-white focus:border-primary/50 focus:outline-none min-h-[120px]"
              />
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => createTopic.mutate()}
                disabled={!newTitle.trim() || !newContent.trim() || createTopic.isPending}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-white/5">
        {topics.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Henüz soru sorulmamış. İlk soran siz olun!
          </div>
        ) : (
          topics.map(topic => (
            <div 
              key={topic.id} 
              onClick={() => setSelectedTopic(topic)}
              className="p-6 hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
                {topic.user?.avatar_url ? (
                  <img src={topic.user.avatar_url.startsWith('/uploads') ? `http://localhost:8000${topic.user.avatar_url}` : topic.user.avatar_url} alt="" className="w-full h-full object-cover"/>
                ) : (
                  topic.user?.full_name?.[0]?.toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-white truncate text-base">{topic.title}</h4>
                  {topic.is_resolved && (
                    <span className="material-symbols-outlined text-emerald-400 text-[16px]" title="Çözüldü">check_circle</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-2">
                  {topic.content}
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <span>{topic.user?.full_name}</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">forum</span>
                    {topic.reply_count} Yanıt
                  </span>
                  <span>{new Date(topic.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseForum;
