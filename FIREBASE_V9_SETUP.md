# 🔥 Firebase v9+ Setup Guide

Perfect! I've updated your Firebase configuration to use the exact v9+ syntax you provided. Here's what's been set up:

## ✅ **Updated Files:**

### 1. **Firebase Configuration** (`frontend/firebase.js`)
```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
```

### 2. **Firestore Rules** (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Each user may read/write only their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Sensor data: only the authenticated owner may read/write sensor docs stored
    // under /sensors/{userId}/{sensorDoc}
    match /sensors/{userId}/{sensorDoc=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public read-only collection (guides, static content)
    match /publicInfo/{doc=**} {
      allow read: if true;
      allow write: if false;
    }

    // Predictions stored per-user
    match /predictions/{userId}/{doc=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Default: deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 🚀 **Setup Options:**

### Option 1: Use NPM (Recommended for Development)
```bash
# Install Firebase
setup-firebase.bat

# Deploy rules
deploy.bat

# Start server
start-server.bat

# Test
http://localhost:8000/test.html
```

### Option 2: Use CDN (No Installation Required)
```bash
# Deploy rules
deploy.bat

# Start server
start-server.bat

# Test with CDN
http://localhost:8000/firebase-cdn.html
```

## 📋 **What's Different:**

### **Firebase v9+ Syntax:**
- ✅ Uses `import { initializeApp } from "firebase/app"`
- ✅ Includes Analytics
- ✅ Modern ES6 module syntax
- ✅ Better tree-shaking and performance

### **Comprehensive Firestore Rules:**
- ✅ User-specific data access
- ✅ Sensor data organization
- ✅ Public content access
- ✅ Predictions per user
- ✅ Secure by default

## 🧪 **Testing:**

### Test with NPM:
1. Run `setup-firebase.bat`
2. Go to `http://localhost:8000/test.html`
3. Test signup functionality

### Test with CDN:
1. Go to `http://localhost:8000/firebase-cdn.html`
2. Test signup functionality (no installation needed)

## 🔧 **Files Created:**

- `frontend/firebase.js` - Updated with v9+ syntax
- `frontend/auth.js` - Updated with v9+ imports
- `frontend/package.json` - NPM configuration
- `setup-firebase.bat` - Firebase installation script
- `frontend/firebase-cdn.html` - CDN test page
- `firestore.rules` - Your exact rules

## 🎯 **Next Steps:**

1. **Choose your setup method** (NPM or CDN)
2. **Deploy Firestore rules**: `deploy.bat`
3. **Test the setup**: Use test pages
4. **Use main pages**: signup.html, login.html, etc.

## 🚨 **Important Notes:**

- **Firestore Rules**: Must be deployed for signup to work
- **Authentication**: Email/Password must be enabled in Firebase Console
- **Project ID**: Using `agriaid-6ad0b` as specified
- **Security**: Rules are secure and user-specific

## 🎉 **Ready to Go!**

Your Firebase v9+ setup is complete with the exact configuration you provided. The signup form should now work perfectly with the modern Firebase syntax and comprehensive security rules!
