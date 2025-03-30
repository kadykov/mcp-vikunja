import axios from 'axios';

interface VikunjaErrorResponse {
  code: number;
  message: string;
}

interface LoginResponse {
  token: string;
}

interface TestUser {
  credentials: {
    username: string;
    email: string;
    password: string;
  };
  token: string;
}

export async function createTestUser(): Promise<TestUser> {
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

  const loginResponse = await axiosInstance.post<LoginResponse>('/login', credentials);
  const { token } = loginResponse.data;

  if (!token) {
    throw new Error('No token received from login');
  }

  return {
    credentials,
    token,
  };
}
