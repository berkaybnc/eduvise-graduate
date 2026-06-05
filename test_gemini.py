import asyncio
import google.generativeai as genai
import json
from dotenv import load_dotenv
import os

load_dotenv("c:\\Users\\berkay\\Desktop\\eduvise graduate\\backend\\.env")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def test_gen():
    prompt = """
    Sen uzman bir eğitim danışmanısın. Aşağıda verilen kursa kayıt olmak isteyen bir öğrenci için 3 adet çoktan seçmeli 'Önkoşul Seviye Tespit Sınavı' (Prerequisite Diagnostic Test) hazırlamalısın.
    Kurs Adı: Yapay Zekaya Giriş
    Kategori: Yazılım
    Bölümler: []
    
    ÖNEMLİ: Sorular kursun İÇERİĞİNİ değil, bu kursu ANLAYABİLMEK İÇİN BİLİNMESİ GEREKEN ÖNKOŞUL temel bilgileri ölçmelidir.
    Ayrıca öğrenci eğer bu testi geçemezse ona sunulacak bir "Önkoşul Yol Haritası" metni (prerequisite_roadmap) oluşturmalısın. Bu metin, öğrenciye bu kursu almadan önce hangi konuları öğrenmesi gerektiğini tavsiye eden teşvik edici bir mesaj olmalıdır.
    
    Lütfen SADECE aşağıdaki formatta bir JSON objesi döndür. Herhangi bir ekstra açıklama ekleme:
    {
      "questions": [
        {
          "id": 1,
          "question": "Önkoşul bilgi sorusu 1",
          "options": ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"],
          "correct": 0
        }
      ],
      "prerequisite_roadmap": "Bu eğitime katılmadan önce şu temel konuları öğrenmeniz faydalı olacaktır: 1. Konu A, 2. Konu B..."
    }
    "correct" alanı 0 ile 3 arasında doğru şıkkın indeksini (0-indexed) belirtmelidir.
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="Sadece JSON çıktısı üret.")
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        print("RAW RESPONSE:", response.text)
        data = json.loads(response.text)
        print("PARSED JSON:", data)
    except Exception as e:
        print("ERROR:", e)

asyncio.run(test_gen())
