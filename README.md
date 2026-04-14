# VMS Pro — Multi-Tenant Visitor Management System (Front-End)

A multi-tenant **Visitor Management System** built with **Angular 12**, featuring role-based access control, real-time notifications, and a modern Material Design UI.

## Features

- 🔐 **Authentication & Authorization** — JWT-based auth with role & permission guards
- 👥 **Visitor Management** — Register, track, and manage visitors
- 🏢 **Multi-Tenant Support** — Isolated data per tenant/location
- 📍 **Location Management** — Manage multiple locations
- 👤 **User & Role Management** — Create users and assign roles with granular permissions
- 🔔 **Real-Time Notifications** — Powered by SignalR
- 📊 **Dashboard & Reports** — Visual analytics with Chart.js
- ⚙️ **Settings** — Configurable application settings

## Tech Stack

| Technology | Version |
|---|---|
| Angular | 12.2 |
| Angular Material | 12.2 |
| RxJS | 6.6 |
| Chart.js | 2.9 |
| SignalR | 7.x |
| TypeScript | 4.3 |

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or v16 recommended)
- [Angular CLI](https://angular.io/cli) v12.x (`npm install -g @angular/cli@12`)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vms-pro-multi-tenant-front-end
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Update the API URLs in `src/environments/environment.ts` (for development) and `src/environments/environment.prod.ts` (for production):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:61988/api',
  signalRUrl: 'http://localhost:61988/hubs/notifications',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
};
```

### 4. Run the Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload on file changes.

## Build

```bash
# Development build
ng build

# Production build
ng build --configuration production
```

Build artifacts are stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── core/            # Auth guards, interceptors, models, global services
│   ├── features/        # Feature modules (visitors, users, roles, etc.)
│   ├── layout/          # Main layout, sidebar, topbar, footer
│   ├── service-proxy/   # API service proxies & DTOs
│   └── shared/          # Shared components, directives, pipes, utilities
├── assets/              # Static assets (images, icons, etc.)
├── environments/        # Environment-specific configuration
└── styles/              # Global SCSS styles
```

## Running Tests

```bash
ng test
```

## License

This project is proprietary. All rights reserved.
