// Simple test script to verify backend API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3333';

async function testAPI() {
  console.log('🧪 Testing Backend API Endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData.message);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }

    // Test sessions endpoint
    console.log('\n2. Testing sessions endpoint...');
    const sessionsResponse = await fetch(`${BASE_URL}/api/sessions`);
    if (sessionsResponse.ok) {
      const sessionsData = await sessionsResponse.json();
      console.log('✅ Sessions endpoint working');
      console.log('   Total sessions:', sessionsData.total);
      console.log('   Sessions data:', sessionsData.sessions);
    } else {
      console.log('❌ Sessions endpoint failed:', sessionsResponse.status);
    }

    // Test root endpoint
    console.log('\n3. Testing root endpoint...');
    const rootResponse = await fetch(`${BASE_URL}/`);
    if (rootResponse.ok) {
      const rootData = await rootResponse.json();
      console.log('✅ Root endpoint working:', rootData.message);
    } else {
      console.log('❌ Root endpoint failed:', rootResponse.status);
    }

  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('   Make sure the backend server is running on port 3333');
  }
}

testAPI();
