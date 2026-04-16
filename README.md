# 1Ummah SILP Management Platform - Frontend Prototype

A Next.js-based school management platform for the **Scholarship Initiative for the Less Privileged (SILP)** program by 1Ummah Islamic Organisation, Abuja.

## Project Overview

This is a **fully functional frontend prototype** built to validate user flows, UI structure, and data requirements before backend development. The application uses mock data and simulates all core functionality without requiring a backend API.

### Key Features

- **Role-based Access Control**: Three distinct user roles (Admin, Staff, School Portal)
- **Student Management**: Complete CRUD operations for beneficiary records
- **School Management**: Directory of participating schools with fee structures
- **Fee Management**: Track and manage termly fees across all students
- **Payment Workflow**: Submit and approve payment requests
- **Dashboard & Analytics**: Visual insights with charts and statistics
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table v8
- **State Management**: React Context API

## Prerequisites

- Node.js 18+ LTS
- npm (comes with Node.js)

## Installation & Setup

1. **Navigate to the project directory**:
   ```bash
   cd "1ummah-silp-frontend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser and visit**:
   ```
   http://localhost:3000
   ```

## Using the Prototype

### Logging In

1. On the landing page, you'll see three role cards:
   - **1Ummah Admin**: Full access to all features
   - **1Ummah Staff**: View and edit access (no deletions or approvals)
   - **School Portal**: Limited to own school's data

2. Click any role card to enter the platform as that user type

3. The role switcher in the top navigation allows you to change roles during your session

### Key Pages & Workflows

#### Admin/Staff Dashboard
- View headline statistics (total students, active schools, fees, pending payments)
- Bar chart showing paid vs outstanding fees by school
- Recent activity feed
- Quick action buttons

#### Student Management
- **List View** (`/dashboard/students`): Search, filter by school/class/status, paginated table
- **Student Profile** (`/dashboard/students/[id]`): Full profile with tabs (to be implemented)

#### Navigation

The sidebar automatically adjusts based on your current role:
- **Admin**: Full menu access including Reports and Generate Fees
- **Staff**: Student, School, Fee, and Payment views (read-only for some features)
- **School**: Own school's students and payment submission

## Mock Data

All data is stored in `/mock-data/` JSON files:

- `students.json`: 38 student records across 10 schools
- `schools.json`: 10 schools in FCT, Borno, Adamawa, and Nasarawa
- `fees.json`: 58 fee records for Terms 1 and 2 (2025/2026)
- `payments.json`: 15 payment requests with various statuses
- `users.json`: 3 user profiles (admin, staff, school)

## Project Structure

```
/app                      # Next.js App Router pages
  /dashboard              # Admin/Staff routes
    /students             # Student management
  page.tsx                # Login/role selector
  layout.tsx              # Root layout with providers

/components
  /layout                 # Sidebar, TopBar, RoleSwitcher
  /ui                     # shadcn/ui components
  /ui-custom              # Custom reusable components

/contexts                 # React context providers (RoleContext)
/lib                      # Utilities, types, mock data loaders
/mock-data                # JSON files with all mock data
```

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Responsive Breakpoints

- **Mobile**: < 768px (stacked layout)
- **Tablet**: 768px - 1023px (collapsible sidebar)
- **Desktop**: 1024px+ (full sidebar visible)

## Design System

### Colors
- **Brand (Primary)**: #0F6E56 (Deep Teal)
- **Brand Light (Accent)**: #E1F5EE (Light Teal)
- **Danger**: #A32D2D (Red)
- **Warning**: #854F0B (Amber)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, tracking-tight
- **Body**: Regular, 14-16px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations (Prototype Only)

1. **No real authentication**: Role switching is simulated
2. **No API calls**: All data is static JSON
3. **No file uploads**: Upload UI shown but files not stored
4. **No real payment processing**: Payment workflow is simulated
5. **No database**: Data resets on page refresh

## Next Steps (Post-Prototype)

After client sign-off on this prototype:

1. **Backend Development**: Build REST or GraphQL API endpoints
2. **Database Design**: PostgreSQL schema matching the mock data structure
3. **Authentication**: Implement JWT-based auth with role permissions
4. **File Storage**: Integrate cloud storage for documents
5. **Payment Integration**: Connect to payment gateway
6. **Deployment**: Host on Vercel/AWS with CI/CD pipeline

## Support & Feedback

For questions, issues, or feedback about this prototype:
- **Client**: 1Ummah Islamic Organisation, Abuja

## License

Proprietary - Copyright © 2026 1Ummah Islamic Organisation

---

**Built for 1Ummah SILP** | Prototype v1.0 | April 2026
