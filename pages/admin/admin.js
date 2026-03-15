import { listAllCourses, createCourse } from '../../data/course-data.js';
import { listAllUsers } from '../../data/user-data.js';
import { listAllBookings } from '../../data/booking-data.js';

const form = document.querySelector('#addCourseForm');
const adminMsg = document.querySelector('#adminMsg');
const bookingsList = document.querySelector('#bookingsList');

const initApp = async () => {
  try {
    form.addEventListener('submit', handleAddCourse);

    const courses = await listAllCourses();
    const users = await listAllUsers();
    const bookings = await listAllBookings();

    displayBookingsPerCourse(courses, users, bookings);
  } catch (error) {
    console.error(error);
  }
};

const showMsg = (text) => {
  adminMsg.hidden = false;
  adminMsg.textContent = text;
};

const hideMsg = () => {
  adminMsg.hidden = true;
  adminMsg.textContent = '';
};

const handleAddCourse = async (e) => {
  e.preventDefault();
  hideMsg();

  const fd = new FormData(form);

  const course = {
    title: String(fd.get('title') || '').trim(),
    courseNumber: String(fd.get('courseNumber') || '').trim(),
    days: Number(fd.get('days')),
    price: Number(fd.get('price')),
    date: String(fd.get('date') || '').trim(),
    mode: String(fd.get('mode') || '').trim(),
    image: String(fd.get('image') || '').trim(),
    description: String(fd.get('description') || '').trim(),
  };

  if (!course.title || !course.courseNumber || !course.days || course.price < 0) {
    showMsg('Fyll i titel, kursnummer, dagar och kostnad.');
    return;
  }

  try {
    showMsg('Sparar kurs...');
    await createCourse(course);
    showMsg('Kurs sparad!');
    form.reset();
  } catch (error) {
    console.error(error);
    showMsg('Kunde inte spara kurs.');
  }
};

const displayBookingsPerCourse = (courses, users, bookings) => {
  bookingsList.innerHTML = '';

  if (bookings.length === 0) {
    bookingsList.innerHTML = '<p>Inga bokningar ännu.</p>';
    return;
  }

  courses
    .filter((course) => bookings.some((b) => b.courseId === course.id))
    .map((course) => {
      const courseBookings = bookings.filter((b) => b.courseId === course.id);

      const section = document.createElement('section');
      section.classList.add('card');

      const title = document.createElement('h2');
      title.textContent = `${course.title} (${course.courseNumber})`;

      section.appendChild(title);

      courseBookings.map((booking) => {
        const user = users.find((u) => u.id === booking.userId);

        const p = document.createElement('p');
        p.textContent = user
          ? `${user.name} • ${user.email} • ${booking.attendance}`
          : `Okänd kund • ${booking.attendance}`;

        section.appendChild(p);
      });

      bookingsList.appendChild(section);
    });
};

document.addEventListener('DOMContentLoaded', initApp);