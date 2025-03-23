# ManhwaNest - Manga & Manhwa Reader

A modern, responsive web application for reading manga and manhwa online, built with Next.js, React, TypeScript, and TailwindCSS.

## Features

- Browse latest and popular manga/manhwa
- Read manga chapters with vertical scrolling or paged navigation
- Bookmark favorite titles
- Responsive design for desktop and mobile
- SEO optimized

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS 4
- Framer Motion

## Deployment on Vercel

### Prerequisites

- A [Vercel](https://vercel.com) account
- [Git](https://git-scm.com) installed on your machine

### Steps to Deploy

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd asuraweb
   ```

2. **Set up environment variables**
   
   Copy the `.env.example` file to `.env.local` and adjust the values as needed:
   ```bash
   cp .env.example .env.local
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Test locally**
   ```bash
   npm run dev
   ```

5. **Deploy to Vercel**

   Option 1: Using Vercel CLI
   ```bash
   # Install Vercel CLI if you haven't already
   npm install -g vercel

   # Login to Vercel
   vercel login

   # Deploy
   vercel
   ```

   Option 2: Using Vercel GitHub Integration
   - Push your repository to GitHub
   - Import your project in the Vercel dashboard
   - Configure the environment variables in the Vercel dashboard
   - Deploy

6. **Configure Environment Variables in Vercel**
   - Go to your project in the Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add the environment variables from `.env.example`

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
```

## License

MIT
