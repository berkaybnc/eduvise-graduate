import React from 'react';

const CourseManager = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Kurs Yöneticisi (Course Manager)</h1>
      <div className="bg-white p-6 rounded shadow-card">
        <p>Eğitmenler için kurs oluşturma ve yönetme modülü burada yer alacaktır.</p>
        <button className="mt-4 bg-primary text-white px-4 py-2 rounded">Yeni Kurs Oluştur</button>
      </div>
    </div>
  );
};

export default CourseManager;
