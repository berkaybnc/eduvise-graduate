import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const CATEGORIES = ["Tümü", "Siber Güvenlik", "Yazılım", "Veri Bilimi", "Yapay Zeka", "Tasarım"];

export const Marketplace = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get('/courses/');
      return response.data;
    }
  });

  if (isLoading) return <div className="p-8">Kurslar yükleniyor...</div>;
  if (error) return <div className="p-8 text-error">Hata oluştu!</div>;

  return (
    <div className="flex-1 max-w-max-content-width w-full mx-auto p-8">
      <div className="mb-lg">
        <h2 className="text-headline-lg font-headline-lg text-on-surface mb-xs">Explore Courses</h2>
        <p className="text-body-md font-body-md text-on-surface-variant">Discover top-rated technical courses curated by AI to match your learning goals.</p>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-primary text-white' 
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
        {courses?.filter(c => selectedCategory === "Tümü" || c.category === selectedCategory).map((course) => (
          <div 
            key={course.id} 
            onClick={() => navigate(`/courses/${course.id}/diagnostic`)}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-card transition-shadow duration-200 flex flex-col cursor-pointer group"
          >
            <div className="h-32 bg-surface-container relative w-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
            </div>
            <div className="p-sm flex flex-col flex-1">
              <h3 className="text-label-md font-label-md font-bold text-on-surface mb-xs group-hover:text-primary transition-colors">{course.title}</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-sm">{course.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
