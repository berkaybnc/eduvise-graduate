import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const InstructorCourseStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['courseStudents', courseId],
    queryFn: async () => {
      const res = await api.get(`/instructor/courses/${courseId}/students`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/instructor/courses')}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-black text-white leading-tight">Öğrenci Analizi</h1>
              <p className="text-slate-400 text-sm">Kursunuzdaki öğrencilerin performans detayları</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Student List */}
          <div className="lg:col-span-1 bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-white/10 bg-black/20">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                Kayıtlı Öğrenciler ({students.length})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {students.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">Henüz öğrenci yok.</div>
              ) : (
                students.map(student => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      selectedStudent?.id === student.id 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 shrink-0 overflow-hidden flex items-center justify-center font-bold text-white">
                      {student.avatar_url ? (
                        <img src={student.avatar_url.startsWith('/uploads') ? `http://localhost:8000${student.avatar_url}` : student.avatar_url} alt="" className="w-full h-full object-cover"/>
                      ) : (
                        student.name[0].toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate text-sm ${selectedStudent?.id === student.id ? 'text-primary' : 'text-white'}`}>
                        {student.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 flex-1 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{width: `${student.progress}%`}}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">%{student.progress}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Analytics */}
          <div className="lg:col-span-2 bg-[#1E293B] border border-white/10 rounded-2xl p-6 flex flex-col h-[600px]">
            {selectedStudent ? (
              <div className="h-full flex flex-col">
                <div className="flex items-start justify-between border-b border-white/10 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-indigo-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-[#1E293B] border-2 border-transparent flex items-center justify-center overflow-hidden font-black text-2xl text-white">
                        {selectedStudent.avatar_url ? (
                          <img src={selectedStudent.avatar_url.startsWith('/uploads') ? `http://localhost:8000${selectedStudent.avatar_url}` : selectedStudent.avatar_url} alt="" className="w-full h-full object-cover"/>
                        ) : (
                          selectedStudent.name[0].toUpperCase()
                        )}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">{selectedStudent.name}</h2>
                      <p className="text-slate-400 text-sm">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Son Görülme</p>
                    <p className="text-white font-medium">{selectedStudent.last_active ? selectedStudent.last_active : 'Bilinmiyor'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 shrink-0">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[28px]">timeline</span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">İlerleme</p>
                      <p className="text-2xl font-black text-white">%{selectedStudent.progress}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[28px]">sports_score</span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Bitirme Sınavı</p>
                      <p className="text-2xl font-black text-white">
                        {selectedStudent.final_score !== null ? `%${selectedStudent.final_score}` : 'Girmedi'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col relative">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                    AI Yetkinlik Radarı
                  </h4>
                  <p className="text-slate-400 text-xs mb-4">Teşhis sınavı sonucuna göre yapay zeka tarafından belirlenen beceri dağılımı.</p>
                  
                  <div className="flex-1 min-h-[250px]">
                    {selectedStudent.radar_data && selectedStudent.radar_data.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={selectedStudent.radar_data}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Skor" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">analytics</span>
                        <p className="text-sm">Yeterli teşhis verisi yok.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">group</span>
                <h3 className="text-xl font-bold text-white mb-2">Öğrenci Seçin</h3>
                <p className="max-w-xs text-sm">Detaylı AI analizini ve gelişim grafiklerini görmek için sol taraftan bir öğrenci seçin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseStudents;
