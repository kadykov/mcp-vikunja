import axios from 'axios';

interface VikunjaErrorResponse {
  code: number;
  message: string;
}

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
    await axiosInstance.post('/register', credentials);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const errorData = error.response.data as VikunjaErrorResponse;
      if (errorData.code !== 1001) {
        throw new Error(`Unexpected registration error: ${errorData.message}`);
      }
      // Code 1001 means user exists, which is fine
    } else {
      throw error; // Rethrow other errors (network issues, etc)
    }
  }

  const loginResponse = await axiosInstance.post('/login', credentials);

  if (!loginResponse.data.token) {
    throw new Error('No token received from login');
  }

  return {
    credentials,
    token: loginResponse.data.token,
  };
}
