export const isValidEmail = (email: string): boolean => {
  const value = email.trim();
  if (!value) return false;
  return value.includes('@') && value.includes('.');
};

type CourseInput = {
  title: string;
  courseNumber: string;
  days: number;
  price: number;
};

export const isValidCourse = (course: CourseInput): boolean => {
  if (!course.title.trim()) return false;
  if (!course.courseNumber.trim()) return false;
  if (!Number.isFinite(course.days) || course.days <= 0) return false;
  if (!Number.isFinite(course.price) || course.price < 0) return false;
  return true;
};