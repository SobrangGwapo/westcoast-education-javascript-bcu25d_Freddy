export const createCourseCard = (course) => {
  const article = document.createElement('article');

  if (course.image) {
    const img = document.createElement('img');
    img.src = '../../' + course.image;
    img.alt = course.title;
    article.appendChild(img);
  }

  const title = document.createElement('h2');
  title.textContent = course.title;

  const parts = [
    course.courseNumber,
    course.days ? `${course.days} dagar` : '',
    Number.isFinite(course.price) ? `${course.price} kr` : '',
    course.date || '',
    course.mode || '',
  ].filter(Boolean);

  const info = document.createElement('p');
  info.textContent = parts.join(' • ');

  const link = document.createElement('a');
  link.href = `../course-detail/course-detail.html?id=${course.id}`;
  link.textContent = 'Visa mer';

  article.appendChild(title);
  article.appendChild(info);
  article.appendChild(link);

  return article;
};

export const setMessage = (element, text = '') => {
  element.hidden = !text;
  element.textContent = text;
};