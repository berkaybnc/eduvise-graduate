import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import useAuthStore from '../store/authStore';

const CertificateGenerator = ({ courseTitle, instructorName, issuedAt, onClose }) => {
  const { user } = useAuthStore();
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${courseTitle.replace(/\s+/g, '_')}_Sertifikasi.pdf`);
    } catch (error) {
      console.error('Sertifika indirilemedi:', error);
    } finally {
      setDownloading(false);
    }
  };

  const formattedDate = new Date(issuedAt).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col max-w-5xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">workspace_premium</span>
            Başarı Sertifikası
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Certificate Preview Box */}
        <div className="overflow-auto bg-black/20 p-8 rounded-2xl border border-white/5 flex justify-center mb-6">
          
          <div 
            ref={certificateRef} 
            className="relative bg-[#FAFAFA] w-[800px] h-[565px] text-slate-900 shrink-0 overflow-hidden shadow-2xl"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Elegant Double Border */}
            <div className="absolute inset-4 border-[3px] border-[#0F172A]"></div>
            <div className="absolute inset-[20px] border border-[#C5A059]"></div>
            
            {/* Corner Accents */}
            <div className="absolute top-[16px] left-[16px] w-8 h-8 border-t-[3px] border-l-[3px] border-[#C5A059]"></div>
            <div className="absolute top-[16px] right-[16px] w-8 h-8 border-t-[3px] border-r-[3px] border-[#C5A059]"></div>
            <div className="absolute bottom-[16px] left-[16px] w-8 h-8 border-b-[3px] border-l-[3px] border-[#C5A059]"></div>
            <div className="absolute bottom-[16px] right-[16px] w-8 h-8 border-b-[3px] border-r-[3px] border-[#C5A059]"></div>
            
            {/* Subtle Watermark/Background Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[300px]">workspace_premium</span>
            </div>

            <div className="relative h-full flex flex-col items-center justify-center p-12 text-center z-10">
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#0F172A] rounded-sm flex items-center justify-center rotate-45 shadow-lg">
                  <span className="material-symbols-outlined text-[#C5A059] text-2xl -rotate-45">school</span>
                </div>
                <span className="text-2xl font-black text-[#0F172A] tracking-widest uppercase">EDUVISE</span>
              </div>
              
              <h1 className="text-5xl font-black text-[#0F172A] tracking-widest mb-3 uppercase" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                BAŞARI SERTİFİKASI
              </h1>
              <p className="text-[#C5A059] uppercase tracking-[0.4em] text-xs font-bold mb-12">
                Bu belge aşağıdaki kişiye takdim edilmiştir
              </p>
              
              <h2 className="text-5xl font-medium text-[#0F172A] mb-8 capitalize italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {user?.full_name?.toLowerCase()}
              </h2>
              
              <p className="text-slate-700 max-w-2xl mx-auto leading-relaxed mb-14 text-sm font-medium">
                Yukarıda adı geçen öğrenci, EduVise eğitim platformu üzerinden sunulan ve 
                <strong className="text-[#0F172A] font-bold"> {instructorName} </strong> tarafından verilen 
                <strong className="text-[#0F172A] font-bold"> "{courseTitle}" </strong> 
                eğitim programını başarıyla tamamlayarak bu sertifikayı almaya hak kazanmıştır.
              </p>
              
              {/* Signatures & Seal Area */}
              <div className="w-full flex justify-between items-end px-12 mt-auto">
                
                {/* Left Signature */}
                <div className="text-center w-40">
                  <div className="h-16 flex items-end justify-center mb-1">
                    <span style={{ fontFamily: "'Brush Script MT', 'Great Vibes', cursive", fontSize: '2rem' }} className="text-[#0F172A] opacity-80">
                      EduVise
                    </span>
                  </div>
                  <div className="border-t border-[#0F172A] pt-2">
                    <p className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest">EduVise Yönetimi</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Kurucu / Direktör</p>
                  </div>
                </div>
                
                {/* Center Seal */}
                <div className="text-center flex flex-col items-center translate-y-4">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Outer Gold Ring */}
                    <div className="absolute inset-0 rounded-full border-[4px] border-dashed border-[#C5A059] animate-[spin_30s_linear_infinite]"></div>
                    {/* Inner Gold Circle */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#E2C37D] via-[#C5A059] to-[#8C6D31] shadow-lg flex items-center justify-center">
                      <div className="w-[86%] h-[86%] rounded-full border border-white/30 flex flex-col items-center justify-center text-white">
                        <span className="material-symbols-outlined text-3xl">verified</span>
                        <span className="text-[8px] font-bold tracking-widest mt-0.5">2026</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Signature (Date) */}
                <div className="text-center w-40">
                  <div className="h-16 flex items-end justify-center mb-1">
                    <span className="text-[#0F172A] font-bold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {formattedDate}
                    </span>
                  </div>
                  <div className="border-t border-[#0F172A] pt-2">
                    <p className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest">Veriliş Tarihi</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Kayıtlı Başarı</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-400 hover:text-white border border-white/10 font-semibold transition-all">
            Kapat
          </button>
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">{downloading ? 'hourglass_empty' : 'download'}</span>
            {downloading ? 'PDF Hazırlanıyor...' : 'PDF Olarak İndir'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CertificateGenerator;
