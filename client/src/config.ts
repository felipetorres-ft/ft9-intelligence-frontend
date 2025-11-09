// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// App Configuration
export const APP_NAME = 'FT9 Intelligence';
export const APP_VERSION = '2.0.0-beta';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'ft9_auth_token',
  USER_DATA: 'ft9_user_data',
  ORG_DATA: 'ft9_org_data',
} as const;
