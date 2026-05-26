import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDGu_flhsK0CQocBwjfkrsKQvbmbpPHuUg',
  authDomain: 'pobresflixhd.firebaseapp.com',
  projectId: 'pobresflixhd',
  storageBucket: 'pobresflixhd.firebasestorage.app',
  messagingSenderId: '238215055329',
  appId: '1:238215055329:web:62414128ac9dbc286db4a0',
};

// Isso evita que o Next.js tente inicializar o Firebase mais de uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
