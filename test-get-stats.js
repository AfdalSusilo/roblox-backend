process.env.DATABASE_URL = 'postgresql://postgres:Silas45Lovet@db.ggqgtgsbgiylkvcgrgvn.supabase.co:5432/postgres';
process.env.NODE_ENV = 'production'; // to test SSL configuration

// Import handler AFTER setting env vars
const { default: handler } = await import('./api/get-stats.js');

// Mock request and response
const req = {
  method: 'GET'
};

const res = {
  status(code) {
    console.log('Status code:', code);
    return this;
  },
  json(data) {
    console.log('JSON Response:', JSON.stringify(data, null, 2));
    return this;
  }
};

async function test() {
  console.log('Running local test for get-stats handler with correct env setup...');
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Test execution crashed:', error);
  }
}

test();
