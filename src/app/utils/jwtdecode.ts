import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  username: string;
  id: string;
  email: string;
}

export const decodeToken = (token: string | null | undefined): DecodedToken => {
  if (!token || token.split('.').length !== 3) {
    console.warn('Invalid or missing JWT token');
    return { username: '', id: '', email: '' };
  }

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (err) {
    console.error('Failed to decode token:', err);
    return { username: '', id: '', email: '' };
  }
};
