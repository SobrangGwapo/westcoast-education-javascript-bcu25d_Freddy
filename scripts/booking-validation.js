export const getBookingFormData = (form) => {
  const fd = new FormData(form);

  return {
    attendance: String(fd.get('attendance') || 'klassrum'),
    name: String(fd.get('name') || '').trim(),
    address: String(fd.get('address') || '').trim(),
    email: String(fd.get('email') || '').trim(),
    phone: String(fd.get('phone') || '').trim(),
  };
};

export const validateBookingForm = ({ name, address, email, phone }) => {
  const errors = [];

  if (!name) errors.push('Namn saknas');
  if (!address) errors.push('Adress saknas');
  if (!email) errors.push('E-post saknas');
  if (!phone) errors.push('Mobilnummer saknas');

  return errors;
};