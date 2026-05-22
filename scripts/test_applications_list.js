(async () => {
  try {
    const fetch = globalThis.fetch || (await import('node-fetch')).default;
    const login = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@college.edu', password: 'admin123' }),
      redirect: 'manual',
    });
    const setCookie = login.headers.get('set-cookie');

    const res = await fetch('http://localhost:3000/api/admin/applications', {
      headers: { Cookie: setCookie },
    });
    console.log('status', res.status);
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
