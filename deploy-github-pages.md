# Deploy Simpsons Toy Store to GitHub Pages

## Prerequisites
- GitHub account
- Git installed on your computer
- Node.js installed locally

## Step-by-Step Deployment Guide

### Step 1: Download Your Project
1. Download all project files from Replit to your local computer
2. Create a new folder called `simpsons-toy-store` and extract all files there

### Step 2: Create GitHub Repository
1. Go to GitHub.com and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it `simpsons-toy-store` (or any name you prefer)
5. Make it public (required for free GitHub Pages)
6. Don't initialize with README since you have existing files
7. Click "Create repository"

### Step 3: Prepare Project for Static Deployment
Since GitHub Pages only serves static files, you'll need to build the frontend only.

1. Open terminal/command prompt in your project folder
2. Install dependencies:
```bash
npm install
```

3. Build the static version:
```bash
npm run build:client
```

### Step 4: Configure for GitHub Pages
1. The build will create a `dist` folder with your static files
2. You need to add a `.nojekyll` file to tell GitHub Pages not to use Jekyll
3. Add proper routing configuration for single-page app

### Step 5: Push to GitHub
1. Initialize git in your project folder:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Add your GitHub repository as remote:
```bash
git remote add origin https://github.com/YOUR_USERNAME/simpsons-toy-store.git
git branch -M main
git push -u origin main
```

### Step 6: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click "Save"

### Step 7: Configure Build Action (Recommended)
Create `.github/workflows/deploy.yml` for automatic deployment when you push changes.

## Important Notes for Firebase Authentication

Since you're using Firebase authentication, you'll need to:

1. **Configure Firebase for your domain:**
   - Go to Firebase Console
   - Select your project
   - Go to Authentication > Settings
   - Add your GitHub Pages domain to "Authorized domains"
   - Your domain will be: `https://YOUR_USERNAME.github.io/simpsons-toy-store`

2. **Update environment variables:**
   - GitHub Pages doesn't support server-side environment variables
   - You'll need to build with the Firebase config directly in the code
   - Or use GitHub Secrets for the build process

## Limitations of GitHub Pages Deployment

- **No backend server**: Your current project has both frontend and backend
- **No server-side storage**: Orders and user data won't persist between sessions
- **Static hosting only**: All functionality must work client-side
- **Authentication works**: Firebase auth will work perfectly
- **Shopping cart**: Will work but reset on page refresh unless using localStorage

## Alternative: Convert to Frontend-Only

I can help you modify the project to work entirely client-side with localStorage for data persistence, which would be perfect for GitHub Pages deployment.

Would you like me to:
1. Create the build scripts and deployment files?
2. Convert the project to work entirely client-side?
3. Set up the GitHub Actions workflow for automatic deployment?