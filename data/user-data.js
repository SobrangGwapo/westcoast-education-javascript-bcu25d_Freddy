export const findUserByEmail = async (email) => {
  const response = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const users = await response.json();
  return users.length ? users[0] : null;
};

export const createUser = async (user) => {
  const response = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const listAllUsers = async () => {
  const response = await fetch('http://localhost:3000/users');
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return await response.json();
};