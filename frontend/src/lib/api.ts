// Base URL of the Express API. Set NEXT_PUBLIC_API_URL when deploying.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
