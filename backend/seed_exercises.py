from app.database import SessionLocal
from app.models.course import Course, CodingExercise

db = SessionLocal()
# Get the first course
course = db.query(Course).first()

if course:
    # check if already has exercises
    existing = db.query(CodingExercise).filter_by(course_id=course.id).first()
    if not existing:
        ex = CodingExercise(
            course_id=course.id,
            title="Temel Değişkenler ve Yazdırma",
            description="""Bu görevde, Python'da değişken tanımlamayı ve ekrana yazdırmayı öğreneceksin.
Aşağıdaki adımları takip et:
1. `mesaj` adında bir değişken oluştur ve içine `"Merhaba Dünya!"` metnini ata.
2. Bu değişkeni `print()` fonksiyonu ile ekrana yazdır.

**Örnek Çıktı:**
```
Merhaba Dünya!
```
""",
            language="python",
            initial_code="# Kodunu buraya yaz\n",
            test_code="Merhaba Dünya!",
            solution_code="mesaj = 'Merhaba Dünya!'\nprint(mesaj)\n"
        )
        db.add(ex)
        db.commit()
        print("Exercise seeded successfully!")
    else:
        print("Exercise already exists.")
else:
    print("No courses found to attach an exercise to.")
