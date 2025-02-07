# Training Hub

A platform for organizing and tracking learning resources across different categories.

## Features

- Resource management with categories
- Progress tracking
- Favorites system
- User authentication with Google
- Admin dashboard
- Chrome extension for easy resource adding

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js
- React Bootstrap
- Chrome Extension

## Prerequisites

- Node.js 18+
- PostgreSQL
- Google OAuth credentials

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/training_hub?schema=public"

# OAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Additional Config
NODE_ENV="development"
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma migrate dev
```

3. Run the development server:
```bash
npm run dev
```

## Deployment

1. Set up environment variables on your hosting platform
2. Deploy the database migrations:
```bash
npx prisma migrate deploy
```

3. Build and deploy the application:
```bash
npm run build
npm start
```

## Chrome Extension

The chrome extension is located in the `chrome-extension` directory. To install:

1. Open Chrome and go to `chrome://extensions`
2. Enable Developer Mode
3. Click "Load unpacked" and select the `chrome-extension` directory

## License

MIT 