import { create } from 'zustand';

const useCourseStore = create((set) => ({
  courses: [],
  setCourses: (courses) => set({ courses }),
  activeCourse: null,
  setActiveCourse: (course) => set({ activeCourse: course }),
}));

export default useCourseStore;
