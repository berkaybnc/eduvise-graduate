import { useState } from 'react';

const PaymentModal = ({ course, onPaymentSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', cardNumber: '', expiry: '', cvc: '' });

  const handlePayment = (e) => {
    e.preventDefault();
    setError('');

    const [monthStr, yearStr] = formData.expiry.split('/');
    if (!monthStr || !yearStr || monthStr.length !== 2 || yearStr.length !== 2) {
      setError('Lütfen geçerli bir son kullanma tarihi girin (AA/YY).');
      return;
    }

    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (month < 1 || month > 12) {
      setError('Geçersiz bir ay girdiniz.');
      return;
    }

    const now = new Date();
    const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setError('Kartınızın son kullanma tarihi geçmiş!');
      return;
    }

    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-md transform transition-all">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">credit_card</span>
            Güvenli Ödeme
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-4 mb-6">
          <p className="text-slate-400 text-sm mb-1">Satın Alınan Kurs</p>
          <p className="text-white font-bold text-lg mb-2">{course.title}</p>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-3">
            <span className="text-slate-400">Toplam Tutar</span>
            <span className="text-emerald-400 font-bold text-xl">₺{course.price}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1">Kart Üzerindeki İsim</label>
            <input 
              required
              type="text" 
              placeholder="Ad Soyad"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1">Kart Numarası</label>
            <div className="relative">
              <input 
                required
                type="text" 
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                value={formData.cardNumber}
                onChange={e => {
                  let val = e.target.value.replace(/\D/g, '');
                  val = val.replace(/(.{4})/g, '$1 ').trim();
                  setFormData({...formData, cardNumber: val});
                }}
                className="w-full bg-[#1E293B] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors tracking-widest font-mono text-sm"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">credit_score</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Son Kullanma (AA/YY)</label>
              <input 
                required
                type="text" 
                placeholder="MM/YY"
                maxLength="5"
                value={formData.expiry}
                onChange={e => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.length > 2) val = val.slice(0,2) + '/' + val.slice(2);
                  setFormData({...formData, expiry: val});
                }}
                className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors text-center tracking-widest font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">CVC</label>
              <input 
                required
                type="text" 
                placeholder="123"
                maxLength="3"
                value={formData.cvc}
                onChange={e => setFormData({...formData, cvc: e.target.value.replace(/\D/g, '')})}
                className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors text-center tracking-widest font-mono"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  İşleniyor...
                </>
              ) : (
                <>
                  Ödemeyi Tamamla
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          256-bit SSL Güvenli Ödeme Noktası (Test)
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;
