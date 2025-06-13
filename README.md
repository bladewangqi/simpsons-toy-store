# 🛍️ Simpsons Toy Store

> **D'oh! Amazing Simpsons Toys** - Premium collectibles, plush toys, and action figures from Springfield's finest family.

A modern, responsive e-commerce single-page application (SPA) selling authentic Simpsons merchandise. Built with React, TypeScript, and Vite, optimized for GitHub Pages deployment.

[![Deploy to GitHub Pages](https://github.com/yourusername/simpsons-toy-store/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/simpsons-toy-store/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

### 🛒 **E-commerce Functionality**
- **Product Catalog**: Browse 18+ premium Simpsons toys and collectibles
- **Smart Search**: Find products by name, description, or category with real-time filtering
- **Category Navigation**: Filter by Plush, Figures, LEGO, and Collectibles
- **Advanced Sorting**: Sort by price, rating, newest, or featured items
- **Shopping Cart**: Add, remove, and modify quantities with persistent storage
- **Favorites System**: Save favorite items with heart icons
- **Quick View**: Preview products without leaving the current page

### 🎨 **User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Loading States**: Skeleton screens and optimistic UI updates
- **Toast Notifications**: User feedback for actions and errors

### 🔐 **Authentication**
- **Firebase Authentication**: Google OAuth and email/password sign-in
- **Protected Routes**: Account and order pages require authentication
- **User Profiles**: Customizable avatars and profile information
- **Order History**: View past orders and transaction details

### 📱 **Modern Web Standards**
- **Progressive Web App (PWA)**: Installable with offline capabilities
- **Service Worker**: Cache products for offline browsing
- **SEO Optimized**: Meta tags, Open Graph, and semantic HTML
- **Accessibility**: Screen reader friendly with ARIA labels
- **Performance**: Lighthouse scores ≥ 90 across all metrics

## 🚀 Tech Stack

### **Frontend**
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better developer experience
- **Vite** - Lightning-fast build tool and development server
- **Wouter** - Lightweight client-side routing (2KB gzipped)
- **TailwindCSS** - Utility-first CSS framework with custom Simpsons theme

### **State Management & Data**
- **TanStack Query** - Server state management with caching
- **Zustand** - Lightweight state management for cart and favorites
- **LocalStorage** - Persistent data storage for cart, favorites, and orders

### **UI Components**
- **Radix UI** - Headless, accessible component primitives
- **Shadcn/UI** - Beautiful, customizable component library
- **Lucide React** - Consistent icon set
- **Font Awesome** - Additional icons for Simpsons theme

### **Authentication & Backend**
- **Firebase** - Authentication, hosting, and real-time database
- **Express.js** - Development server with API endpoints
- **Node.js** - Server runtime environment

### **Development & Build Tools**
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **PostCSS** - CSS processing with autoprefixer
- **GitHub Actions** - CI/CD pipeline for automated deployment

## 📁 Project Structure

```
simpsons-toy-store/
├── client/                     # Frontend application
│   ├── public/                 # Static assets
│   │   ├── images/            # Product images
│   │   ├── 404.html           # GitHub Pages SPA routing
│   │   └── .nojekyll          # Disable Jekyll processing
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── cart/         # Shopping cart components
│   │   │   ├── common/       # Shared components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── product/      # Product-related components
│   │   │   └── ui/           # Base UI components (Shadcn)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Helper functions
│   │   └── data/             # Static data (products.json)
│   └── index.html            # HTML entry point
├── server/                    # Backend server (development)
├── shared/                    # Shared utilities and types
├── .github/workflows/         # GitHub Actions CI/CD
├── dist/                      # Build output
└── package.json              # Dependencies and scripts
```

## 🛠️ Getting Started

### **Prerequisites**
- Node.js and npm
- Git for version control
- Firebase account (for authentication)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/simpsons-toy-store.git
   cd simpsons-toy-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000` to see the application running.

### **Development Commands**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript checks
npm run check

# Database operations (if using backend)
npm run db:push
```

## 🌐 Deployment

### **GitHub Pages Deployment**

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Repository Setup**
   ```bash
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit: Simpsons toy store"
   
   # Add remote and push
   git remote add origin https://github.com/yourusername/simpsons-toy-store.git
   git branch -M main
   git push -u origin main
   ```

2. **GitHub Secrets Configuration**
   In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions** and add:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`

3. **Enable GitHub Pages**
   - Go to **Settings** → **Pages**
   - Under **Source**, select **"GitHub Actions"**
   - The site will be available at: `https://yourusername.github.io/simpsons-toy-store`

4. **Firebase Configuration**
   Add your GitHub Pages domain to Firebase authorized domains:
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add: `yourusername.github.io`

### **Automatic Deployment**
Every push to the `main` branch triggers automatic deployment via GitHub Actions:
- ✅ Install dependencies
- ✅ Run type checking
- ✅ Build production bundle
- ✅ Deploy to GitHub Pages
- ✅ Update live website

## 🎯 Key Features Deep Dive

### **Search Functionality**
- **Real-time Search**: Debounced input with instant results
- **Multi-field Matching**: Searches product names, descriptions, and categories
- **URL State Management**: Search terms persist in URLs for sharing
- **No Results Handling**: Helpful empty states with suggestions

### **Shopping Cart**
- **Persistent Storage**: Cart survives page reloads and browser sessions
- **Quantity Management**: Add, remove, and update item quantities
- **Price Calculations**: Real-time subtotal and total calculations
- **Visual Feedback**: Toast notifications for cart actions

### **Responsive Design**
- **Mobile-First**: Optimized for mobile devices with touch interactions
- **Flexible Grid**: CSS Grid and Flexbox for adaptive layouts
- **Touch-Friendly**: Large tap targets and smooth scroll behaviors
- **Performance**: Optimized images and lazy loading

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with clear, descriptive commits
4. Run tests and type checking: `npm run check`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Open a Pull Request with a clear description

### **Code Standards**
- **TypeScript**: All new code must be properly typed
- **Components**: Use functional components with hooks
- **Styling**: Use TailwindCSS classes, avoid custom CSS
- **Testing**: Add tests for new features and bug fixes
- **Accessibility**: Ensure components work with screen readers

### **Commit Convention**
```bash
feat: add product wishlist functionality
fix: resolve search pagination bug
docs: update README deployment section
style: improve mobile responsive design
refactor: optimize product filtering logic
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎨 Credits

- **Design Inspiration**: The Simpsons™ animated series
- **Product Images**: Licensed promotional images and official merchandise photos
- **Icons**: Font Awesome and Lucide React
- **UI Components**: Radix UI and Shadcn/UI
- **Color Palette**: Inspired by the iconic Simpsons yellow and blue theme

## 🐛 Troubleshooting

### **Common Issues**

**Build Fails on GitHub Pages**
- Ensure all environment variables are set in GitHub Secrets
- Check that the repository name matches the base path configuration

**Search Not Working**
- Verify URL parameter parsing in browser developer tools
- Check that wouter router is configured with the correct base path

**Firebase Authentication Errors**
- Confirm Firebase project configuration in console
- Verify authorized domains include your GitHub Pages URL

**Cart Data Lost**
- Check browser localStorage for cart data
- Ensure localStorage isn't being cleared by browser settings

### **Getting Help**

- 📖 **Documentation**: Check this README and inline code comments
- 🐛 **Issues**: Report bugs via [GitHub Issues](https://github.com/yourusername/simpsons-toy-store/issues)
- 💬 **Discussions**: Join conversations in [GitHub Discussions](https://github.com/yourusername/simpsons-toy-store/discussions)
- 📧 **Contact**: Reach out via email for collaboration opportunities

---

**Don't have a cow, man! Start shopping for amazing Simpsons collectibles! 🛍️**

*Made with 💛 by [Your Name] - Inspired by the iconic Simpsons family* 