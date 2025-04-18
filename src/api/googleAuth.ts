// Google API credentials
export const GOOGLE_API_KEY = 'AIzaSyCmFcGcQ80-_l9ion40zn2s-3l5oPyfKdY';
export const GOOGLE_CLIENT_ID = '786082493014-bg86pdo341e9ud8j505ip7k0aigk5acb.apps.googleusercontent.com';

// Google API scopes needed for the application
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

// Function to load the Google API client library
export const loadGoogleApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client
          .init({
            apiKey: GOOGLE_API_KEY,
            clientId: GOOGLE_CLIENT_ID,
            scope: GOOGLE_SCOPES.join(' '),
            discoveryDocs: [
              'https://sheets.googleapis.com/$discovery/rest?version=v4',
              'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
            ],
          })
          .then(() => {
            resolve();
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    };
    script.onerror = (error) => {
      reject(error);
    };
    document.body.appendChild(script);
  });
};

// Function to check if user is signed in
export const isSignedIn = (): boolean => {
  if (!window.gapi || !window.gapi.auth2) {
    return false;
  }
  return window.gapi.auth2.getAuthInstance().isSignedIn.get();
};

// Function to sign in
export const signIn = async (): Promise<any> => {
  if (!window.gapi || !window.gapi.auth2) {
    throw new Error('Google API not loaded');
  }
  try {
    const googleAuth = window.gapi.auth2.getAuthInstance();
    const user = await googleAuth.signIn({ prompt: 'consent' });
    return user;
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};

// Function to sign out
export const signOut = async (): Promise<void> => {
  if (!window.gapi || !window.gapi.auth2) {
    throw new Error('Google API not loaded');
  }
  try {
    const googleAuth = window.gapi.auth2.getAuthInstance();
    await googleAuth.signOut();
  } catch (error) {
    console.error('Error signing out from Google', error);
    throw error;
  }
};

// Function to get current user
export const getCurrentUser = (): any => {
  if (!isSignedIn()) {
    return null;
  }
  return window.gapi.auth2.getAuthInstance().currentUser.get();
};

// Function to get user profile
export const getUserProfile = (): any => {
  const user = getCurrentUser();
  if (!user) {
    return null;
  }
  const profile = user.getBasicProfile();
  return {
    id: profile.getId(),
    name: profile.getName(),
    email: profile.getEmail(),
    imageUrl: profile.getImageUrl(),
  };
};

// Add TypeScript declarations for the global window object
declare global {
  interface Window {
    gapi: any;
  }
}
