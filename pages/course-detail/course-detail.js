import { getCourse } from '../../data/course-data.js';
import { findUserByEmail } from '../../data/user-data.js';
import { createBooking } from '../../data/booking-data.js';
import { setMessage } from '../../scripts/dom.js';
import {
  getBookingFormData,
  validateBookingForm,
} from '../../scripts/booking-validation.js';

let loggedInUser = null;
let currentCourse = null;

const initApp = async () => {
  const courseId = location.search.split('=')[1];
  currentCourse = await getCourse(courseId);

  if (!currentCourse) {
    document.querySelector('#courseDetails').innerHTML = '<p>Kursen hittades inte.</p>';
    return;
  }

  createDisplayCourse(currentCourse);
  setupLogin();
  setupBooking();
};

const createDisplayCourse = (course) => {
  document.querySelector('#courseDetails').innerHTML = `
    <section class="card">
      <img src="../../${course.image}" alt="${course.title}" />
      <div class="info">
        <h2>${course.title}</h2>
        <div><span>Kursnummer</span> <span>${course.courseNumber}</span></div>
        <div><span>Antal dagar</span> <span>${course.days}</span></div>
        <div><span>Datum</span> <span>${course.date}</span></div>
        <div><span>Form</span> <span>${course.mode}</span></div>
        <div><span>Pris</span> <span>${course.price} kr</span></div>
        <h3>Om kursen</h3>
        <div class="description">${course.description || ''}</div>
      </div>
    </section>
  `;
};

const setupLogin = () => {
  const loginBtn = document.getElementById('loginBtn');
  const loginEmail = document.getElementById('loginEmail');
  const loginMsg = document.getElementById('loginMsg');

  loginBtn.addEventListener('click', async () => {
    const email = String(loginEmail.value || '').trim().toLowerCase();

    if (!email) {
      setMessage(loginMsg, 'Skriv in din e-post.');
      return;
    }

    try {
      setMessage(loginMsg, 'Loggar in...');
      const user = await findUserByEmail(email);

      if (!user) {
        loggedInUser = null;
        localStorage.removeItem('loggedInUser');
        setMessage(loginMsg, 'Ingen användare med den e-posten.');
        return;
      }

      loggedInUser = user;
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      setMessage(loginMsg, `Inloggad som ${user.email}`);
    } catch (err) {
      console.error(err);
      setMessage(loginMsg, 'Kunde inte logga in.');
    }
  });
};

const setupBooking = () => {
  const form = document.getElementById('bookingForm');
  const bookingMsg = document.getElementById('bookingMsg');
  const formErrors = document.getElementById('formErrors');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMessage(formErrors);
    setMessage(bookingMsg);

    if (!loggedInUser) {
      setMessage(formErrors, 'Du måste logga in för att boka.');
      return;
    }

    const formData = getBookingFormData(form);
    const errors = validateBookingForm(formData);

    if (errors.length) {
      setMessage(formErrors, errors.join(', '));
      return;
    }

    try {
      setMessage(bookingMsg, 'Skickar bokning...');

      const booking = {
        courseId: currentCourse.id,
        userId: loggedInUser.id,
        attendance: formData.attendance,
        createdAt: new Date().toISOString(),
        customer: {
          name: formData.name,
          address: formData.address,
          email: formData.email,
          phone: formData.phone,
        },
      };

      await createBooking(booking);

      setMessage(bookingMsg, 'Bokning skapad!');
      form.reset();
    } catch (err) {
      console.error(err);
      setMessage(formErrors, 'Kunde inte skapa bokningen.');
    }
  });
};

document.addEventListener('DOMContentLoaded', initApp);