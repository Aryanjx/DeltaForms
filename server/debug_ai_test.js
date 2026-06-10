import fetch from 'node-fetch';

const baseUrl = 'http://127.0.0.1:5000';

const registerOrLogin = async () => {
  const credentials = { username: 'debuguser2', email: 'debuguser2@example.com', password: 'DebugPass123' };

  const registerRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (registerRes.status === 201) {
    const data = await registerRes.json();
    return data.token;
  }

  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: credentials.email, password: credentials.password })
  });

  const loginData = await loginRes.json();
  return loginData.token;
};

const run = async () => {
  try {
    const token = await registerOrLogin();
    console.log('TOKEN LENGTH', token?.length);

    const res = await fetch(`${baseUrl}/api/ai/generate-layout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ prompt: 'Create a contact form with name, email, phone, and a message textarea.' })
    });

    console.log('STATUS', res.status);
    console.log(await res.text());
  } catch (err) {
    console.error('ERR', err);
  }
};

run();
