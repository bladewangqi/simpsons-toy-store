# Deploy Simpsons Toy Store to GitHub Pages

## Complete Step-by-Step Guide

### Step 1: Download Your Project from Replit
1. In Replit, click the three dots menu (⋯) in the file explorer
2. Select "Download as zip"
3. Extract the zip file to a folder on your computer called `simpsons-toy-store`

### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Repository name: `simpsons-toy-store` (or your preferred name)
4. Set to **Public** (required for free GitHub Pages)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 3: Prepare for Static Deployment

Your project needs some modifications to work on GitHub Pages since it currently has both frontend and backend components.

1. **Install dependencies locally:**
```bash
cd simpsons-toy-store
npm install
```

2. **Create required files:**

Create `client/public/.nojekyll` (empty file):
```bash
touch client/public/.nojekyll
```

3. **Add GitHub Actions workflow** (already created: `.github/workflows/deploy.yml`)

### Step 4: Configure Firebase for GitHub Pages

1. **Get your GitHub Pages URL:**
   - It will be: `https://YOUR_USERNAME.github.io/REPOSITORY_NAME`
   - Example: `https://johndoe.github.io/simpsons-toy-store`

2. **Update Firebase Console:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Go to **Authentication** → **Settings** → **Authorized domains**
   - Add your GitHub Pages domain: `YOUR_USERNAME.github.io`

### Step 5: Set Up GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these three secrets:
   - `VITE_FIREBASE_API_KEY`: Your Firebase API key
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID  
   - `VITE_FIREBASE_APP_ID`: Your Firebase app ID

### Step 6: Push to GitHub

1. **Initialize git and push:**
```bash
git init
git add .
git commit -m "Initial commit: Simpsons toy store"
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
git branch -M main
git push -u origin main
```

### Step 7: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The site will be available at: `https://YOUR_USERNAME.github.io/REPOSITORY_NAME`

### Step 8: Verify Deployment

1. Wait 2-3 minutes for the GitHub Action to complete
2. Check the **Actions** tab to see deployment status
3. Visit your GitHub Pages URL
4. Test Firebase authentication and shopping cart functionality

## What Works on GitHub Pages

✅ **Full frontend functionality**
✅ **Firebase authentication** 
✅ **Shopping cart** (stored in browser)
✅ **Product browsing and search**
✅ **Responsive Simpsons theme**
✅ **Order creation** (stored locally)

## Limitations

⚠️ **Orders don't persist** between browser sessions (no backend database)
⚠️ **Cart resets** when you close browser (unless localStorage)
⚠️ **No server-side features**

## Automatic Updates

Every time you push code to the `main` branch, GitHub Actions will automatically:
1. Build your project
2. Deploy to GitHub Pages
3. Update your live website

## Troubleshooting

**Build fails?**
- Check that all Firebase secrets are set correctly in GitHub
- Verify the workflow file syntax

**Firebase auth not working?**
- Ensure your GitHub Pages domain is added to Firebase authorized domains
- Check browser console for specific error messages

**Site not loading?**
- Wait a few minutes after deployment
- Check that GitHub Pages is enabled and using GitHub Actions source

Your Simpsons toy store will be live at `https://YOUR_USERNAME.github.io/REPOSITORY_NAME` once deployed!