# Student Feedback System

A comprehensive student feedback system built with modern web technologies for collecting and analyzing course evaluations from students.

## Features

- **Course Management**: Complete CRUD operations for courses with department categorization
- **Rating System**: 5-star rating system with detailed feedback comments
- **Analytics Dashboard**: Department-wise analytics, rating distributions, and comprehensive statistics
- **Search & Filtering**: Advanced course search by name, code, instructor, and department
- **Responsive Design**: Mobile-first design with proper responsive breakpoints

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- shadcn/ui components for modern UI
- TanStack Query for state management
- Wouter for routing

### Backend
- Express.js with TypeScript
- RESTful API design
- Zod for request validation
- In-memory storage for development

### Key Libraries
- React Hook Form for form handling
- Recharts for data visualization
- Lucide React for icons
- date-fns for date utilities

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Setup Instructions for Local Development

If you downloaded this project from another platform:

1. **Replace package.json** with `package-clean.json`:
   ```bash
   mv package-clean.json package.json
   ```

2. **Replace vite.config.ts** with `vite-clean.config.ts`:
   ```bash
   mv vite-clean.config.ts vite.config.ts
   ```

3. **Install dependencies and start**:
   ```bash
   npm install
   npm run dev
   ```

## Project Structure

```
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
├── server/              # Express.js backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   └── storage.ts       # Data storage layer
├── shared/              # Shared types and schemas
└── package.json         # Project dependencies
```

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses with filtering
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Feedback
- `POST /api/feedback` - Submit course feedback
- `GET /api/feedback/:courseId` - Get feedback for a course

### Analytics
- `GET /api/analytics/overview` - Get overview statistics
- `GET /api/analytics/rating-distribution` - Get rating distribution
- `GET /api/analytics/departments` - Get department analytics

## Development

The application uses a monorepo structure with shared TypeScript types between frontend and backend. Hot module replacement is enabled for fast development cycles.

### Key Design Decisions
- Used in-memory storage for simplicity and fast development
- Implemented type-safe API with shared schemas
- Built responsive design with mobile-first approach
- Added comprehensive form validation and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details