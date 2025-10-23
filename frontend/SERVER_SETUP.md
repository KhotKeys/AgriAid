# 🚀 **SERVER SETUP GUIDE**

## ❌ **The Problem**
You were opening HTML files directly from the file system (`file://` protocol), which causes CORS errors and prevents JavaScript from loading.

## ✅ **The Solution**
You need to serve your files through a web server.

## 🔧 **How to Start the Server**

### **Method 1: Python (Recommended)**
1. Open Command Prompt or PowerShell
2. Navigate to your project folder:
   ```bash
   cd "C:\Users\HP\OneDrive\Desktop\K-kedom-.-Tools-master\frontend"
   ```
3. Start the server:
   ```bash
   python -m http.server 8000
   ```
4. Open your browser and go to: `http://localhost:8000`

### **Method 2: Node.js (if installed)**
1. Open Command Prompt or PowerShell
2. Navigate to your project folder:
   ```bash
   cd "C:\Users\HP\OneDrive\Desktop\K-kedom-.-Tools-master\frontend"
   ```
3. Start the server:
   ```bash
   npx http-server -p 8000
   ```
4. Open your browser and go to: `http://localhost:8000`

## 🎯 **Test Your Application**

Once the server is running:

1. **Go to:** `http://localhost:8000`
2. **Login:** `http://localhost:8000/login.html`
3. **Dashboard:** `http://localhost:8000/user-dashboard.html`
4. **Resource Sharing:** `http://localhost:8000/resource-sharing.html`

## 🔍 **What to Check**

- ✅ No CORS errors in browser console
- ✅ JavaScript files load properly
- ✅ Logout button works on all pages
- ✅ All functionality works as expected

## 🚨 **Important Notes**

- **Always use `http://localhost:8000`** instead of opening files directly
- **Keep the server running** while testing
- **Stop the server** with `Ctrl+C` when done
- **Restart the server** if you make changes to files

## 🎉 **Expected Result**

Once you access your app through `http://localhost:8000`, the logout button should work perfectly on all dashboard pages!
