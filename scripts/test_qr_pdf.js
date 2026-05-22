(async () => {
  try {
    const fs = await import('fs');
    const fetch = globalThis.fetch || (await import('node-fetch')).default;
    const studentId = 'cmpgxumeq0000dwi0mbpvzgf1';

    const login = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@college.edu', password: 'admin123' }),
      redirect: 'manual',
    });
    const setCookie = login.headers.get('set-cookie');

    const qrRes = await fetch(`http://localhost:3000/api/admin/id-card/${studentId}/qr`, {
      headers: { Cookie: setCookie },
    });
    console.log('qr status', qrRes.status);
    const qrJson = await qrRes.json();
    console.log('qr length', qrJson.qrCode?.length || 0);

    const pdfRes = await fetch(`http://localhost:3000/api/admin/id-card/${studentId}/pdf`, {
      method: 'POST',
      headers: { Cookie: setCookie },
    });
    console.log('pdf status', pdfRes.status);
    const arr = await pdfRes.arrayBuffer();
    const buf = Buffer.from(arr);
    fs.writeFileSync('tmp-id-card.pdf', buf);
    console.log('wrote tmp-id-card.pdf', buf.length, 'bytes');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
