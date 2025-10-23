// Import Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, onSnapshot, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

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

const DEFAULT_AVATAR = './images/africa_numbers_cover.jpg'; // Updated default image for all admins

// Store user info in localStorage
function storeUserInfo(userData) {
    localStorage.setItem('sf_user', JSON.stringify(userData));
}

// Update the UI with admin info
function updateUserInfoDisplay(userData) {
    if (!userData) return;
    const adminNameEl = document.getElementById('admin-name');
    const adminRoleEl = document.getElementById('admin-role');
    const avatarEl = document.querySelector('.user-profile .avatar');
    if (adminNameEl) adminNameEl.textContent = userData.fullName || userData.firstName || 'Admin';
    if (adminRoleEl) adminRoleEl.textContent = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : '';
    if (avatarEl) avatarEl.src = userData.profilePicUrl || DEFAULT_AVATAR;
}

function setupLogout() {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                console.log('Admin signed out successfully');
            } catch (error) {
                console.error('Error signing out:', error);
            }
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

function fetchAllUsers() {
    const usersTableBody = document.getElementById('users-table-body');
    const totalUsersCountEl = document.getElementById('total-users-count');
    if (!usersTableBody) return;
    onSnapshot(collection(db, 'users'), (snapshot) => {
        if (totalUsersCountEl) {
            totalUsersCountEl.textContent = snapshot.size;
        }
        usersTableBody.innerHTML = snapshot.docs.map(doc => {
            const user = doc.data();
            const regDate = user.createdAt && user.createdAt.toDate ? user.createdAt.toDate().toLocaleDateString() : '';
            return `
                <tr>
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${regDate}</td>
                    <td><span class="status-active">Active</span></td>
                </tr>
            `;
        }).join('');
    });
}

// Fetch admin info from Firestore or fallback to Auth info
async function fetchAndDisplayAdminInfo(user) {
    if (!user) return;
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let userData;
        if (userDoc.exists()) {
            userData = userDoc.data();
            userData.email = user.email;
            userData.uid = user.uid;
        } else {
            userData = {
                fullName: user.displayName || 'Admin',
                email: user.email,
                uid: user.uid,
                role: 'admin',
                profilePicUrl: user.photoURL || DEFAULT_AVATAR
            };
        }
        storeUserInfo(userData);
        updateUserInfoDisplay(userData);
    } catch (err) {
        console.error('Error fetching admin info:', err);
        const userData = {
            fullName: user.displayName || 'Admin',
            email: user.email,
            uid: user.uid,
            role: 'admin',
            profilePicUrl: user.photoURL || DEFAULT_AVATAR
        };
        storeUserInfo(userData);
        updateUserInfoDisplay(userData);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let authChecked = false;
    
    onAuthStateChanged(auth, (user) => {
        if (!authChecked) {
            authChecked = true;
            
            if (user) {
                console.log('Admin authenticated:', user.email);
                fetchAndDisplayAdminInfo(user);
            } else {
                console.log('No admin authenticated, redirecting to login');
                // Check if we have user data in localStorage as fallback
                const storedUser = localStorage.getItem('sf_user');
                if (storedUser) {
                    try {
                        const userData = JSON.parse(storedUser);
                        if (userData.role === 'admin') {
                            console.log('Using stored admin data:', userData);
                            updateUserInfoDisplay(userData);
                            return; // Don't redirect if we have valid stored admin data
                        }
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

const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const location = document.getElementById('location').value;
        const role = document.getElementById('role').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) return alert("Passwords do not match.");
        if (!role) return alert('Please select a role.');
        if (password.length < 6) return alert("Password must be at least 6 characters long.");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('About to write user to Firestore:', { firstName, lastName, email, phone, location, role });
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                email,
                phone,
                location,
                role,
                createdAt: new Date()
            });
            console.log('User written to Firestore!');
            alert('Sign up successful! Please proceed to login.');
            window.location.href = 'login.html';
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
} 