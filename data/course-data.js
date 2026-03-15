export const getCourse = async (id) => {
  const response = await fetch(`http://localhost:3000/courses/${id}`);
  if (!response.ok) {
    return null;
  }
  return await response.json();
};

export const listAllCourses = async () => {
  const response = await fetch('http://localhost:3000/courses');
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return await response.json();
};

export const createCourse = async (course) => {
  const response = await fetch('http://localhost:3000/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return await response.json();
};