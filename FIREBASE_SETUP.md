# Firebase Setup Guide for AgriAid

This guide will help you set up Firebase for the AgriAid project and resolve any integration issues.

## Prerequisites

1. **Node.js** (version 14 or higher)
2. **Firebase CLI** - Install globally:
   ```bash
   npm install -g firebase-tools
   ```

## Firebase Project Configuration

The project is already configured to use the AgriAid Firebase project:
- **Project ID**: `agriaid-6ad0b`
- **Auth Domain**: `agriaid-6ad0b.firebaseapp.com`

## Setup Steps

### 1. Install Firebase CLI and Login

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### 2. Initialize Firebase in the Project

```bash
# Navigate to the project root
cd "C:\Users\HP\OneDrive\Desktop\K-kedom-.-Tools-master"

# Initialize Firebase (if not already done)
firebase init
```

When prompted:
- Select **Firestore** and **Hosting**
- Use existing project: `agriaid-6ad0b`
- Use default settings for other options

### 3. Deploy Firebase Rules and Configuration

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

Or use the provided batch file:
```bash
deploy-firebase.bat
```

### 4. Enable Firebase Services

In the Firebase Console (https://console.firebase.google.com/):

1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable **Email/Password** provider
   - Save changes

2. **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Choose a location (preferably `us-central1` or `nam5`)

3. **Realtime Database**:
   - Go to Realtime Database
   - Create database in test mode
   - Choose a location

## Testing Firebase Integration

1. Open `firebase-test.html` in your browser
2. Run the connection test to verify Firebase is working
3. Test authentication, Firestore, and Realtime Database functionality

## File Structure

```
frontend/
├── firebase-config.js      # Original Firebase configuration
├── firebase-init.js        # New centralized Firebase service
├── auth-service.js         # Authentication service
├── firebase-test.html      # Firebase testing page
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
└── firebase.json          # Firebase project configuration
```

## Key Features Implemented

### 1. Authentication
- User registration with profile data
- User login/logout
- Role-based access (farmer/admin)
- Persistent authentication state

### 2. Firestore Integration
- User profile storage
- Sensor data storage
- Real-time data synchronization
- Admin dashboard data

### 3. Security Rules
- User-specific data access
- Admin privileges for data management
- Secure authentication requirements

## Troubleshooting

### Common Issues

1. **"Firebase not initialized" error**:
   - Check if `firebase-init.js` is loaded before other scripts
   - Verify Firebase configuration is correct

2. **"Permission denied" error**:
   - Deploy Firestore rules: `firebase deploy --only firestore:rules`
   - Check if user is authenticated
   - Verify security rules allow the operation

3. **"User not found" error**:
   - Check if user document exists in Firestore
   - Verify user registration completed successfully

4. **Module import errors**:
   - Ensure all HTML pages load `firebase-init.js` first
   - Check browser console for import errors

### Testing Steps

1. **Test Connection**:
   ```javascript
   // Open browser console and run:
   import('./firebase-init.js').then(fb => {
       console.log('Firebase initialized:', !!fb.auth);
   });
   ```

2. **Test Authentication**:
   - Use the test page at `firebase-test.html`
   - Try creating a test user
   - Verify user appears in Firebase Console

3. **Test Firestore**:
   - Check if data is written to Firestore
   - Verify security rules are working
   - Test real-time updates

## Development Workflow

1. **Make changes** to Firebase configuration or rules
2. **Test locally** using `firebase-test.html`
3. **Deploy changes** using `firebase deploy`
4. **Verify** in Firebase Console

## Production Considerations

1. **Security Rules**: Review and tighten security rules for production
2. **Authentication**: Enable additional providers if needed
3. **Database**: Consider upgrading to production mode
4. **Monitoring**: Set up Firebase monitoring and alerts

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify Firebase Console for data and authentication status
3. Test with the provided `firebase-test.html` page
4. Review Firebase documentation: https://firebase.google.com/docs

## Quick Commands

```bash
# Deploy everything
firebase deploy

# Deploy only rules
firebase deploy --only firestore:rules

# Deploy only hosting
firebase deploy --only hosting

# View project status
firebase projects:list

# Switch project
firebase use agriaid-6ad0b
```
