import { listAllCourses } from '../../data/course-data.js';
import { createCourseCard } from '../../scripts/dom.js';

const popularCoursesEl = document.querySelector('#popularCourses');

const initApp = async () => {
  const courses = await listAllCourses();
  const popularCourses = courses.filter((course) => course.popular === true);

  popularCoursesEl.innerHTML = '';

  if (popularCourses.length === 0) {
    popularCoursesEl.innerHTML = '<p>Inga populära kurser just nu.</p>';
    return;
  }

  popularCourses.forEach((course) => {
    popularCoursesEl.appendChild(createCourseCard(course));
  });
};

document.addEventListener('DOMContentLoaded', initApp);