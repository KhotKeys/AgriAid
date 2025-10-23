// Firebase Configuration using CDN imports (works without bundler)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtFuLj86FT3Xe3zOkfZz45nQ-HaICG1l8",
  authDomain: "agriaid-6ad0b.firebaseapp.com",
  projectId: "agriaid-6ad0b",
  storageBucket: "agriaid-6ad0b.firebasestorage.app",
  messagingSenderId: "529552760039",
  appId: "1:529552760039:web:461d55da50b1d623f85642",
  measurementId: "G-HHV5BDNDHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
try {
    analytics = getAnalytics(app);
} catch (err) {
    console.warn('Analytics not available:', err);
}
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services
export { app, analytics, auth, db };
