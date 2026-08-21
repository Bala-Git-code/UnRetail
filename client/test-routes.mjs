import { spawn } from 'child_process';
import http from 'http';

const routes = [
  '/',
  '/admin/login',
  '/admin/dashboard',
  '/login',
  '/feed',
  '/search',
  '/shops',
  '/orders',
  '/orders/success',
  '/checkout',
  '/dashboard',
  '/dashboard/listings',
  '/dashboard/new-item',
  '/dashboard/orders',
  '/item/item-101',
  '/orders/ord_123/success',
];

async function checkUrl(port, path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, bodyLength: data.length });
      });
    }).on('error', (err) => reject(err));
  });
}

async function run() {
  const PORT = 3099;
  console.log(`Starting Next.js server on port ${PORT}...`);
  
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'inherit',
  });

  // Wait for server to become ready
  let ready = false;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      await checkUrl(PORT, '/');
      ready = true;
      break;
    } catch (e) {
      // not ready yet
    }
  }

  if (!ready) {
    console.error('Server failed to start in time');
    server.kill();
    process.exit(1);
  }

  console.log('\n--- TESTING ALL ROUTES ---');
  let hasFailures = false;

  for (const route of routes) {
    try {
      const res = await checkUrl(PORT, route);
      if (res.status === 200) {
        console.log(`[PASS] ${route} -> Status ${res.status} (${res.bodyLength} bytes)`);
      } else {
        console.error(`[FAIL] ${route} -> Status ${res.status}`);
        hasFailures = true;
      }
    } catch (err) {
      console.error(`[FAIL] ${route} -> Error: ${err.message}`);
      hasFailures = true;
    }
  }

  console.log('--- ALL ROUTES TESTED ---\n');
  server.kill('SIGTERM');
  
  if (hasFailures) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
