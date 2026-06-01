import { useState, useRef } from 'react';
import api from '../lib/api';

const FileUploadZone = ({ onUploaded, accept, label, icon, hint }) => {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(null);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/courses/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploaded({ name: res.data.filename, url: res.data.url });
      onUploaded(res.data.url, res.data.filename);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Yükleme başarısız');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
          ${uploaded ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-primary/40 hover:bg-primary/5'}`}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => handleFile(e.target.files[0])} />
        {uploading ? (
          <>
            <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
            <p className="text-slate-300 text-sm font-semibold">Yükleniyor...</p>
          </>
        ) : uploaded ? (
          <>
            <span className="material-symbols-outlined text-emerald-400 text-4xl">check_circle</span>
            <p className="text-emerald-400 text-sm font-semibold truncate max-w-full px-4">{uploaded.name}</p>
            <button type="button" onClick={e => { e.stopPropagation(); setUploaded(null); onUploaded('', ''); }}
              className="text-xs text-slate-500 hover:text-white underline">Değiştir</button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-2xl">{icon}</span>
            </div>
            <p className="text-slate-300 text-sm font-semibold">{label}</p>
            <p className="text-slate-500 text-xs">{hint}</p>
          </>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FileUploadZone;
