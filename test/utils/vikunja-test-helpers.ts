import axios from 'axios';

export async function createTestUser() {
  const credentials = {
    username: 'mcp-test-user',
    email: 'mcp-test@example.com',
    password: 'test-password-123',
  };

  const API_BASE = 'http://vikunja:3456/api/v1';
  const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  try {
    console.log('Attempting to register user...');
    // Try to register the user (will fail if exists, which is fine)
    await axiosInstance.post('/register', credentials);
    console.log('User registration successful');
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as { response?: { status: number; data: unknown } };
      console.log(
        'Registration error (might be expected if user exists):',
        axiosError.response?.status,
        axiosError.response?.data
      );
    } else {
      console.log('Unknown registration error:', error);
    }
  }

  console.log('Attempting to login...');
  const loginResponse = await axiosInstance.post('/login', credentials);
  console.log('Login successful, got token');

  const token = loginResponse.data.token;
  if (!token) {
    console.error('No token in login response:', loginResponse.data);
    throw new Error('No token received from login');
  }

  return {
    credentials,
    token,
  };
}
