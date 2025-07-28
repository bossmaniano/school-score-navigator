#!/bin/bash

# Deployment script for React + Supabase School Management System
# This script provides options to deploy to different platforms

echo "🚀 School Management System Deployment Script"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Build the application
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Display deployment options
echo "Choose your deployment platform:"
echo "1) Vercel (Recommended - Easy and fast)"
echo "2) Netlify (Great for static sites)"
echo "3) Railway (Docker-based)"
echo "4) GitHub Pages (Free with GitHub)"
echo "5) Preview locally"
echo "6) Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "🔵 Deploying to Vercel..."
        echo "Follow the prompts to login and deploy."
        vercel --prod
        ;;
    2)
        echo "🟢 Deploying to Netlify..."
        echo "Please install Netlify CLI: npm install -g netlify-cli"
        echo "Then run: netlify deploy --prod"
        echo "Or manually upload the 'dist' folder to netlify.com"
        ;;
    3)
        echo "🟣 Railway deployment instructions:"
        echo "1. Push your code to GitHub"
        echo "2. Go to railway.app and connect your repository"
        echo "3. Railway will automatically detect the Dockerfile"
        ;;
    4)
        echo "⚫ GitHub Pages deployment instructions:"
        echo "1. Push your code to GitHub"
        echo "2. Go to repository Settings → Pages"
        echo "3. Enable GitHub Actions workflow"
        echo "4. The workflow is already configured in .github/workflows/deploy.yml"
        ;;
    5)
        echo "👀 Starting local preview..."
        npx serve dist -s
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment process completed!"
echo ""
echo "📊 Your application includes:"
echo "   - Working Supabase database"
echo "   - User authentication"
echo "   - Role-based access control"
echo "   - School management features"
echo ""
echo "🔗 Database URL: https://xqhyfvxirabxfivafmtt.supabase.co"
echo "📧 For support, check the DEPLOYMENT.md file"