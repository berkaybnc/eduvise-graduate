import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDiagnostic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) {
      alert("Lütfen bir seçenek işaretleyin!");
      return;
    }

    setIsAnalyzing(true);
    // Simüle edilmiş AI analizi
    setTimeout(() => {
      setIsAnalyzing(false);
      navigate(`/courses/${id}`);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-bright px-4">
      <div className="max-w-3xl w-full bg-surface border border-outline-variant rounded-xl p-8 shadow-sm">
        
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Seviyeniz Analiz Ediliyor...</h2>
            <p className="text-on-surface-variant">Yapay zeka size en uygun yol haritasını çıkartıyor.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6 bg-primary-container text-on-primary-container p-4 rounded-lg">
              <span className="material-symbols-outlined text-3xl">psychology</span>
              <div>
                <h1 className="text-xl font-bold">Kurs Öncesi Tanılama (Diagnostic)</h1>
                <p className="text-sm">Bu kursa başlamadan önce seviyenizi ölçelim.</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Soru: Aşağıdakilerden hangisi bir programlama döngüsü türüdür?</h2>
              <div className="space-y-3">
                {['If-Else', 'For', 'Class', 'String'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full p-4 border-2 rounded-lg text-left font-bold transition-all ${
                      selectedOption === opt 
                        ? 'border-primary bg-primary-container text-on-primary-container' 
                        : 'border-outline-variant hover:border-outline'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Analizi Tamamla ve Kursa Başla
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default CourseDiagnostic;
