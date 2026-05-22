(async () => {
  try {
    const fetch = globalThis.fetch || (await import('node-fetch')).default;
    const res = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@college.edu', password: 'admin123' }),
      redirect: 'manual',
    });

    console.log('status', res.status);
    for (const [k, v] of res.headers.entries()) {
      if (k.toLowerCase().includes('set-cookie')) {
        console.log('set-cookie:', v);
      }
    }
    const text = await res.text();
    console.log('body:', text);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
