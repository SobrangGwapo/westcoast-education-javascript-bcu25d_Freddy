import { listAllCourses } from '../../data/course-data.js';
import { createCourseCard } from '../../scripts/dom.js';

const coursesList = document.querySelector('#coursesList');

const initApp = async () => {
  const courses = await loadCourses();
  displayCourses(courses);
};

const loadCourses = async () => {
  return await listAllCourses();
};

const displayCourses = (courses) => {
  coursesList.innerHTML = '';

  courses.forEach((course) => {
    coursesList.appendChild(createCourseCard(course));
  });
};

document.addEventListener('DOMContentLoaded', initApp);