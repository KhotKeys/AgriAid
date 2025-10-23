// Initialize Firebase using the new clean service
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Firebase configuration
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
    console.log('🖼️ Updating user info display with data:', userData);
    
    if (!userData) {
        console.log('⚠️ No user data provided to updateUserInfoDisplay');
        return;
    }
    
    // Update user name - remove "Loading..." immediately
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
        const displayName = userData.fullName || userData.firstName || userData.displayName || 'User';
        userNameEl.textContent = displayName;
        userNameEl.style.opacity = '1';
        console.log('✅ Updated user name to:', displayName);
    } else {
        console.log('❌ Element with id "user-name" not found');
    }
    
    // Update user role
    const roleEl = document.getElementById('user-role');
    if (roleEl) {
        const displayRole = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Farmer';
        roleEl.textContent = displayRole;
        roleEl.style.opacity = '1';
        console.log('✅ Updated user role to:', displayRole);
    } else {
        console.log('❌ Element with id "user-role" not found');
    }
    
    // Update avatar
    const avatarEl = document.querySelector('.user-profile .avatar');
    if (avatarEl) {
        avatarEl.src = userData.profilePicUrl || DEFAULT_AVATAR;
        avatarEl.style.opacity = '1';
        console.log('✅ Updated avatar');
    } else {
        console.log('❌ Avatar element not found');
    }
    
    // Update other optional elements
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) {
        welcomeMsg.textContent = `Welcome back, ${userData.fullName || userData.firstName || userData.displayName || 'User'}!`;
        console.log('✅ Updated welcome message');
    }
    
    // Update additional user info if elements exist
    if (document.getElementById('user-email')) {
        document.getElementById('user-email').textContent = userData.email || '';
        console.log('✅ Updated user email');
    }
    if (document.getElementById('user-location')) {
        document.getElementById('user-location').textContent = userData.location || '';
        console.log('✅ Updated user location');
    }
    if (document.getElementById('user-phone')) {
        document.getElementById('user-phone').textContent = userData.phone || '';
        console.log('✅ Updated user phone');
    }
    
    console.log('🎉 User info display update completed');
}

// Logout handler with proper Firebase signOut
async function setupLogout() {
    console.log('🚪 Setting up logout functionality...');
    
    // Wait a bit for DOM to be fully ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        console.log('✅ Logout button found, adding event listener');
        
        // Remove any existing listeners to avoid duplicates
        const newLogoutButton = logoutButton.cloneNode(true);
        logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
        
        newLogoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('🔓 Logout button clicked');
            
            // Show loading state
            const originalContent = newLogoutButton.innerHTML;
            newLogoutButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Logging out...</span>';
            newLogoutButton.disabled = true;
            
            try {
                // Sign out from Firebase
                console.log('🔥 Signing out from Firebase...');
                await signOut(auth);
                console.log('✅ Firebase sign out successful');
                
                // Clear local storage
                console.log('🧹 Clearing localStorage...');
                localStorage.clear();
                sessionStorage.clear();
                console.log('✅ Storage cleared');
                
                // Redirect to login
                console.log('🔄 Redirecting to login page...');
                window.location.href = 'login.html';
                
            } catch (error) {
                console.error('❌ Logout error:', error);
                // Reset button state
                newLogoutButton.innerHTML = originalContent;
                newLogoutButton.disabled = false;
                
                // Even if Firebase logout fails, clear local storage and redirect
                console.log('🧹 Clearing localStorage despite error...');
                localStorage.clear();
                sessionStorage.clear();
                console.log('🔄 Redirecting to login despite error...');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    } else {
        console.log('❌ Logout button not found! Looking for element with id "logout-btn"');
        // Debug: Let's see what buttons are available
        const allButtons = document.querySelectorAll('button');
        console.log('🔍 Available buttons:', Array.from(allButtons).map(btn => ({ id: btn.id, class: btn.className, text: btn.textContent })));
        
        // Try again after a delay
        setTimeout(() => setupLogout(), 500);
    }
}

// Fetch user info from Firestore or fallback to Auth info
async function fetchAndDisplayUserInfo(user) {
    if (!user) return;
    
    try {
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let userData;
        
        if (userDoc.exists()) {
            userData = userDoc.data();
            userData.email = user.email;
            userData.uid = user.uid;
            console.log('User data loaded from Firestore:', userData);
        } else {
            // Fallback to Auth info if Firestore doc is missing
            const emailName = user.email ? user.email.split('@')[0] : 'User';
            userData = {
                fullName: user.displayName || emailName,
                firstName: user.displayName?.split(' ')[0] || emailName,
                email: user.email,
                uid: user.uid,
                role: 'farmer', // default role if missing
                profilePicUrl: user.photoURL || DEFAULT_AVATAR
            };
            console.log('Using fallback user data:', userData);
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
        console.log('Using error fallback user data:', userData);
        storeUserInfo(userData);
        updateUserInfoDisplay(userData);
    }
}

// Initialize Firebase and setup dashboard
async function initDashboard() {
    console.log('🚀 Starting dashboard initialization...');
    
    try {
        console.log('✅ Firebase already initialized');
        console.log('🔐 Auth object:', !!auth);
        console.log('🗄️ Firestore object:', !!db);
        
        // Setup logout functionality immediately
        console.log('🚪 Setting up logout functionality...');
        await setupLogout();
        
        // Setup authentication state listener
        console.log('👤 Setting up auth state listener...');
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('✅ User authenticated:', user.email);
                console.log('📋 User UID:', user.uid);
                // Immediately show basic user info to remove "Loading..."
                updateUserInfoDisplay({
                    fullName: user.displayName || user.email.split('@')[0] || 'User',
                    email: user.email,
                    uid: user.uid,
                    role: 'farmer'
                });
                // Then fetch complete user info from Firestore
                fetchAndDisplayUserInfo(user);
            } else {
                console.log('❌ User not authenticated, redirecting to login');
                // Small delay to avoid redirect loops
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
        
        // Check current user immediately
        const currentUser = auth.currentUser;
        if (currentUser) {
            console.log('📋 Current user found immediately:', currentUser.email);
        } else {
            console.log('⏳ No immediate current user, waiting for auth state change...');
        }
        
    } catch (error) {
        console.error('❌ Dashboard initialization error:', error);
        console.error('Error details:', error.stack);
        
        // Immediate fallback - set basic user info to remove "Loading..."
        console.log('🔄 Setting basic fallback user info...');
        const userNameEl = document.getElementById('user-name');
        const userRoleEl = document.getElementById('user-role');
        
        if (userNameEl && userNameEl.textContent === 'Loading...') {
            userNameEl.textContent = 'User';
            userNameEl.style.opacity = '1';
        }
        if (userRoleEl) {
            userRoleEl.textContent = 'Farmer';
            userRoleEl.style.opacity = '1';
        }
        
        // Try to load user data from localStorage as fallback
        const savedUser = localStorage.getItem('sf_user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                console.log('💾 Loading fallback user data from localStorage:', userData);
                updateUserInfoDisplay(userData);
                // Still try to setup logout even with fallback data
                await setupLogout();
            } catch (parseError) {
                console.error('❌ Error parsing saved user data:', parseError);
                // Stay on dashboard with basic info rather than redirect
                console.log('⚠️ Staying on dashboard with basic info');
            }
        } else {
            console.log('⚠️ No fallback data available, showing basic info');
            // Don't redirect immediately, let user try to logout or navigate
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, initializing dashboard...');
    console.log('🔍 Checking for logout button...');
    
    // Check if logout button exists immediately
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        console.log('✅ Logout button found in DOM');
        console.log('🔍 Button element:', logoutBtn);
        console.log('🔍 Button classes:', logoutBtn.className);
        console.log('🔍 Button style:', window.getComputedStyle(logoutBtn).display);
        
        // Add immediate click handler for testing
        logoutBtn.addEventListener('click', (e) => {
            console.log('🔓 IMMEDIATE LOGOUT CLICKED!');
            e.preventDefault();
            e.stopPropagation();
            
            // Simple immediate logout
            localStorage.clear();
            sessionStorage.clear();
            alert('Logging out...');
            window.location.href = 'login.html';
        });
        
        // Add additional event listeners for better compatibility
        logoutBtn.addEventListener('mousedown', (e) => {
            console.log('🔓 Logout button mousedown detected');
        });
        
        logoutBtn.addEventListener('mouseup', (e) => {
            console.log('🔓 Logout button mouseup detected');
        });
        
        // Force button to be clickable
        logoutBtn.style.pointerEvents = 'auto';
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.style.position = 'relative';
        logoutBtn.style.zIndex = '1000';
        logoutBtn.style.userSelect = 'none';
        logoutBtn.style.webkitUserSelect = 'none';
        logoutBtn.style.webkitTapHighlightColor = 'transparent';
        
        console.log('🔧 Button styles applied:', {
            pointerEvents: logoutBtn.style.pointerEvents,
            cursor: logoutBtn.style.cursor,
            zIndex: logoutBtn.style.zIndex,
            position: logoutBtn.style.position
        });
        
        console.log('✅ Immediate logout handler added');
    } else {
        console.log('❌ Logout button NOT found in DOM');
    }
    
    // Add a small delay to ensure all resources are loaded
    setTimeout(() => {
        initDashboard();
    }, 100);
});

// Also try to initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM loaded, initializing dashboard...');
        setTimeout(() => {
            initDashboard();
        }, 100);
    });
} else {
    console.log('📄 DOM already loaded, initializing dashboard immediately...');
    setTimeout(() => {
        initDashboard();
    }, 100);
} 