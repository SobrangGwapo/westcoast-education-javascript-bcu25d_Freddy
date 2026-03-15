import HttpClient from '../../data/httpClient.js';
import { Course } from '../../models/course.js';
import { User } from '../../models/user.js';
import { Booking } from '../../models/booking.js';
import { isValidCourse } from '../../utils/validation.js';

const coursesApi = new HttpClient<Course>('courses');
const coursesListApi = new HttpClient<Course[]>('courses');
const usersApi = new HttpClient<User[]>('users');
const bookingsApi = new HttpClient<Booking[]>('bookings');

const form = document.querySelector('#addCourseForm') as HTMLFormElement;
const adminMsg = document.querySelector('#adminMsg') as HTMLDivElement;
const bookingsList = document.querySelector('#bookingsList') as HTMLDivElement;
const adminArea = document.querySelector('#adminArea') as HTMLDivElement;

const getLoggedInUser = (): User | null => {
  const user = localStorage.getItem('loggedInUser');

  if (!user) {
    return null;
  }

  return JSON.parse(user) as User;
};

const initApp = async () => {
  try {
    const loggedInUser = getLoggedInUser();

    if (!loggedInUser || loggedInUser.admin !== true) {
      adminArea.hidden = true;
      bookingsList.innerHTML = '';
      adminMsg.hidden = false;
      adminMsg.textContent = 'Du måste vara inloggad som admin för att komma åt denna sida.';
      return;
    }

    adminMsg.hidden = true;
    adminMsg.textContent = '';
    adminArea.hidden = false;

    form.addEventListener('submit', handleAddCourse);
    await refreshBookings();
  } catch (error) {
    console.error(error);
  }
};

const showMsg = (text: string) => {
  adminMsg.hidden = false;
  adminMsg.textContent = text;
};

const hideMsg = () => {
  adminMsg.hidden = true;
  adminMsg.textContent = '';
};

const handleAddCourse = async (e: SubmitEvent) => {
  e.preventDefault();
  hideMsg();

  const fd = new FormData(form);

  const course: Course = {
    title: String(fd.get('title') || '').trim(),
    courseNumber: String(fd.get('courseNumber') || '').trim(),
    days: Number(fd.get('days')),
    price: Number(fd.get('price')),
    date: String(fd.get('date') || '').trim(),
    mode: String(fd.get('mode') || '').trim(),
    image: String(fd.get('image') || '').trim(),
    description: String(fd.get('description') || '').trim(),
  };

  if (!isValidCourse(course)) {
    showMsg('Fyll i titel, kursnummer, dagar och kostnad.');
    return;
  }

  try {
    showMsg('Sparar kurs...');
    await coursesApi.add(course);
    showMsg('Kurs sparad!');
    form.reset();
    await refreshBookings();
  } catch (error) {
    console.error(error);
    showMsg('Kunde inte spara kurs.');
  }
};

const refreshBookings = async () => {
  const courses = await coursesListApi.listAll();
  const users = await usersApi.listAll();
  const bookings = await bookingsApi.listAll();

  displayBookingsPerCourse(courses, users, bookings);
};

const displayBookingsPerCourse = (courses: Course[], users: User[], bookings: Booking[]) => {
  bookingsList.innerHTML = '';

  if (bookings.length === 0) {
    bookingsList.innerHTML = '<p>Inga bokningar ännu.</p>';
    return;
  }

  courses
    .filter((course) => bookings.some((b) => String(b.courseId) === String(course.id)))
    .map((course) => {
      const courseBookings = bookings.filter((b) => String(b.courseId) === String(course.id));

      const section = document.createElement('section');
      section.classList.add('card');

      const title = document.createElement('h2');
      title.textContent = `${course.title} (${course.courseNumber})`;
      section.appendChild(title);

      courseBookings.map((booking) => {
        const user = users.find((u) => String(u.id) === String(booking.userId));

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