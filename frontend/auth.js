// Simple Authentication Service for AgriAid
import { auth, db } from './firebase.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Sign up a new user
export async function signUp(email, password, userData) {
    try {
        console.log('Creating user account...');
        
        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('User created:', user.uid);
        
        // Create user profile in Firestore
        const profile = {
            uid: user.uid,
            email: user.email,
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        
        await setDoc(doc(db, 'users', user.uid), profile);
        console.log('User profile saved to Firestore');
        
        return { user, profile };
    } catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }
}

// Sign in existing user
export async function signIn(email, password) {
    try {
        console.log('Signing in user...');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const profile = userDoc.exists() ? userDoc.data() : null;
        
        return { user, profile };
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
}

// Sign out user
export async function signOutUser() {
    try {
        await signOut(auth);
        console.log('User signed out');
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
}

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}

// Listen to auth state changes
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// Get user profile
export async function getUserProfile(uid) {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
        console.error('Get user profile error:', error);
        throw error;
    }
}
