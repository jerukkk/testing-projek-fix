# Next.js + Sanity MUN (Model United Nations) Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and integrated with [Sanity.io](https://www.sanity.io/) for content management.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

Before running the application, you need to set up your environment variables. Copy `.env.local.example` to `.env.local` and fill in your Sanity credentials:

```bash
cp .env.local.example .env.local
```

Then update the values in `.env.local` with your Sanity project details.

## Sanity Integration

This project is set up to connect to Sanity.io for content management. The following files handle the integration:

- `src/lib/sanity.client.ts` - Sanity client configuration
- `src/lib/sanity.config.ts` - Sanity project configuration
- `src/lib/sanity.image.ts` - Image URL builder

## Test Page

Visit `/test` route to verify the connection to Sanity:

```
http://localhost:3000/test
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about Sanity.io:

- [Sanity Documentation](https://www.sanity.io/docs) - learn about Sanity concepts and API.
- [Sanity Studio](https://www.sanity.io/studio) - content management interface.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.