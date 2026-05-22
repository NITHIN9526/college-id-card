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
    console.log('login status', login.status);
    console.log('set-cookie header:', setCookie);

    const statsRes = await fetch('http://localhost:3000/api/admin/stats', {
      method: 'GET',
      headers: { Cookie: setCookie },
    });

    console.log('stats status', statsRes.status);
    const statsJson = await statsRes.json();
    console.log('stats body:', JSON.stringify(statsJson, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
