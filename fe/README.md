This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file in the root of the `frontend` directory with the following content:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

**Note:** Make sure your backend server is running on port 3000. If your backend runs on a different port, update the URL accordingly.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or the port shown in the terminal) with your browser to see the result.

### 4. Make sure Backend is Running

Before using the frontend, ensure your backend server is running:

```bash
cd ../backend
npm run dev
```

The backend should be running on `http://localhost:3000`

## Features

- ✅ View all contacts
- ✅ Create new contact
- ✅ Edit contact
- ✅ Delete contact
- ✅ Modern UI with Tailwind CSS

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
