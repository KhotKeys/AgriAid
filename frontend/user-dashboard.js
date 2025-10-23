// Import Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Firebase configuration (same as login.html)
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
const auth = getAuth(app);
const db = getFirestore(app);

const DEFAULT_AVATAR = './images/africa_numbers_cover.jpg'; // Updated default image for all users

// Store user info in localStorage
function storeUserInfo(userData) {
    localStorage.setItem('sf_user', JSON.stringify(userData));
}

// Update the UI with user info
function updateUserInfoDisplay(userData) {
    if (!userData) return;
    const userNameEl = document.getElementById('user-name');
    const roleEl = document.getElementById('user-role');
    const avatarEl = document.querySelector('.user-profile .avatar');
    if (userNameEl) userNameEl.textContent = userData.fullName || userData.firstName || 'User';
    if (roleEl) roleEl.textContent = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : '';
    if (avatarEl) avatarEl.src = userData.profilePicUrl || DEFAULT_AVATAR;
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) welcomeMsg.textContent = `Welcome back, ${userData.fullName || userData.firstName || 'User'}!`;
    const badge = document.getElementById('role-badge');
    if (badge) {
        badge.textContent = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : '';
        badge.className = 'badge ' + (userData.role || '');
    }
    if (document.getElementById('user-email')) document.getElementById('user-email').textContent = userData.email || '';
    if (document.getElementById('user-location')) document.getElementById('user-location').textContent = userData.location || '';
    if (document.getElementById('user-phone')) document.getElementById('user-phone').textContent = userData.phone || '';
    // Optionally show/hide admin section
    if (userData.role === 'admin' && document.getElementById('admin-section')) {
        document.getElementById('admin-section').style.display = 'block';
    } else if (document.getElementById('admin-section')) {
        document.getElementById('admin-section').style.display = 'none';
    }
}

// Logout handler
function setupLogout() {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                // Import signOut function
                const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
                await signOut(auth);
                console.log('User signed out successfully');
            } catch (error) {
                console.error('Error signing out:', error);
            }
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

// Fetch user info from Firestore or fallback to Auth info
async function fetchAndDisplayUserInfo(user) {
    if (!user) return;
    try {
        // Always fetch fresh data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let userData;
        if (userDoc.exists()) {
            userData = userDoc.data();
            userData.email = user.email;
            userData.uid = user.uid;
        } else {
            // Fallback to Auth info if Firestore doc is missing
            userData = {
                fullName: user.displayName || 'User',
                email: user.email,
                uid: user.uid,
                role: 'farmer', // default role if missing
                profilePicUrl: user.photoURL || DEFAULT_AVATAR
            };
        }
        // Always overwrite localStorage with fresh data
        storeUserInfo(userData);
        updateUserInfoDisplay(userData);
    } catch (err) {
        console.error('Error fetching user info:', err);
        // Fallback to Auth info
        const userData = {
            fullName: user.displayName || 'User',
            email: user.email,
            uid: user.uid,
            role: 'farmer',
            profilePicUrl: user.photoURL || DEFAULT_AVATAR
        };
        storeUserInfo(userData);
        updateUserInfoDisplay(userData);
    }
}

// Main entry: only redirect if user is not authenticated
// Always fetch fresh user info on each login

document.addEventListener('DOMContentLoaded', () => {
    let authChecked = false;
    
    onAuthStateChanged(auth, (user) => {
        if (!authChecked) {
            authChecked = true;
            
            if (user) {
                console.log('User authenticated:', user.email);
                fetchAndDisplayUserInfo(user);
            } else {
                console.log('No user authenticated, redirecting to login');
                // Check if we have user data in localStorage as fallback
                const storedUser = localStorage.getItem('sf_user');
                if (storedUser) {
                    try {
                        const userData = JSON.parse(storedUser);
                        console.log('Using stored user data:', userData);
                        updateUserInfoDisplay(userData);
                        return; // Don't redirect if we have valid stored data
                    } catch (e) {
                        console.error('Invalid stored user data:', e);
                        localStorage.removeItem('sf_user');
                    }
                }
                window.location.href = 'login.html';
            }
        }
    });
    
    setupLogout();
}); 