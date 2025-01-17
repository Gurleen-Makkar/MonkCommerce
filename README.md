# Monk Commerce

A modern coupon management system built with React and Node.js. Check out the demo:

[![Product Showcase](https://img.youtube.com/vi/J9yQY0IvKgI/0.jpg)](https://www.youtube.com/watch?v=J9yQY0IvKgI)

## Features

- Create, edit, and delete coupons
- Apply coupons to products
- Real-time validation
- Responsive design
- Modern UI/UX

## Tech Stack

- Frontend: React, Redux Toolkit, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Start the development servers:
   ```bash
   # Start backend
   cd backend && npm start
   
   # Start frontend
   cd frontend && npm run dev
   ```

## Environment Variables

Create a `.env` file in the backend directory with:
```
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## API Documentation

The API documentation is available at `/api-docs` when running the backend server.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
