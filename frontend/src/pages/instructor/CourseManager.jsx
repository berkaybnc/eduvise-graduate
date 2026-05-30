import { useState } from 'react';

const CourseManager = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-on-surface">Kurs ve İçerik Yöneticisi</h1>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          Yeni Kurs Oluştur
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-outline-variant">
        <button 
          onClick={() => setActiveTab('courses')}
          className={`pb-3 font-bold text-lg px-2 transition-colors ${activeTab === 'courses' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Kurslarım
        </button>
        <button 
          onClick={() => setActiveTab('upload')}
          className={`pb-3 font-bold text-lg px-2 transition-colors ${activeTab === 'upload' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Video & Dosya Yükle
        </button>
      </div>

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Örnek Kurs Kartı */}
          <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <div className="h-40 bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-primary opacity-50">laptop_chromebook</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">İleri Düzey Python</h3>
                <span className="bg-primary-container text-on-primary-container text-xs px-2 py-1 rounded-full font-bold">Yazılım</span>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">Bu kurs toplam 12 bölüm ve 45 videodan oluşmaktadır.</p>
              <div className="flex justify-between items-center border-t border-outline-variant pt-4">
                <span className="text-sm font-bold text-secondary">124 Öğrenci</span>
                <button className="text-primary text-sm font-bold hover:underline">Düzenle</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-sm max-w-2xl">
          <h2 className="text-xl font-bold mb-6">Yeni İçerik Ekle</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-label-md text-on-surface mb-1">Hangi Kursa Eklenecek?</label>
              <select className="w-full p-3 bg-surface-container rounded-lg border border-outline-variant">
                <option>İleri Düzey Python</option>
                <option>Siber Güvenliğe Giriş</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-label-md text-on-surface mb-1">Bölüm (Section) Adı</label>
              <input type="text" className="w-full p-3 bg-surface-container rounded-lg border border-outline-variant" placeholder="Örn: Değişkenler ve Veri Tipleri" />
            </div>
            <div>
              <label className="block text-sm font-label-md text-on-surface mb-1">Video Dosyası veya URL</label>
              <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-4xl mb-2">cloud_upload</span>
                <p>Videoyu buraya sürükleyin veya seçin</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-label-md text-on-surface mb-1">Ders Notları (PDF, ZIP)</label>
              <input type="file" className="w-full p-2 text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary-container-hover" />
            </div>
            <button type="button" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark">İçeriği Yükle</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CourseManager;
