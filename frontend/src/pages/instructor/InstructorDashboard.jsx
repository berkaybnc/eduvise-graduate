import useAuthStore from '../../store/authStore';

const InstructorDashboard = () => {

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Eğitmen Paneli: Analiz ve Gelir Raporu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-center items-center">
          <p className="text-on-surface-variant font-label-lg mb-2">Toplam Öğrenci</p>
          <p className="text-4xl font-bold text-primary">1,248</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-center items-center">
          <p className="text-on-surface-variant font-label-lg mb-2">Ortalama Puan</p>
          <p className="text-4xl font-bold text-secondary">4.8 / 5.0</p>
        </div>
        <div className="bg-primary p-6 rounded-xl border border-primary shadow-sm flex flex-col justify-center items-center text-white">
          <p className="font-label-lg mb-2 opacity-80">Bu Ayki Tahmini Gelir</p>
          <p className="text-4xl font-bold">$3,450</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Son Yorumlar ve Değerlendirmeler</h2>
        <div className="space-y-4">
          <div className="p-4 bg-surface-container rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-primary">Ahmet Y.</span>
              <span className="text-secondary font-bold">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-on-surface-variant text-sm">"Python kursunuz harika! Ders notlarını indirip çalışmak çok faydalı oldu."</p>
          </div>
          <div className="p-4 bg-surface-container rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-primary">Ayşe D.</span>
              <span className="text-secondary font-bold">⭐⭐⭐⭐</span>
            </div>
            <p className="text-on-surface-variant text-sm">"Ders anlatımınız çok akıcı ancak pratik örnekleri artırabilirsiniz."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
