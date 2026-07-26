# 🎨 SEAL – Hackathon Management Platform (Frontend Client)

[![Next.js](https://img.shields.io/badge/Next.js-16.x_App_Router-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query/v5)
[![Zustand](https://img.shields.io/badge/Zustand-v4-443E38?logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO_Client-v4-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An ultra-modern, high-performance **Frontend Application** for **SEAL** (Software Engineering & AI-driven Hackathon Management Platform). Built on Next.js 16 App Router, React 19, TailwindCSS, TanStack Query v5, Zustand, and Socket.IO, this application offers role-segmented workspaces, real-time event synchronization, glassmorphism design tokens, and zero-latency optimistic UI updates.

---

## 📐 Architecture & System Flow

The Frontend application adopts a **Feature-Driven Component Architecture** with complete separation of concerns between Server Components (RSC for static/initial data fetching) and Client Components (interactive dynamic views).

```mermaid
graph TD
    User[User / Web Browser] --> Router[Next.js 16 App Router Middleware]
    
    subgraph "Role-Based Route Segments"
        Router -->|/organizer/*| OrganizerSpace[Organizer Workspace & Admin Panels]
        Router -->|/student/*| StudentSpace[Student Event Workspace & Team Hub]
        Router -->|/judge/*| JudgeSpace[Judge Evaluation Portal & Rubrics]
        Router -->|/mentor/*| MentorSpace[Mentor Advisory & Team Feedback]
    end

    subgraph "State & Data Fetching Layer"
        OrganizerSpace & StudentSpace & JudgeSpace & MentorSpace --> ZustandStore[Zustand Global Auth & UI Stores]
        OrganizerSpace & StudentSpace & JudgeSpace & MentorSpace --> QueryClient[TanStack Query v5 Server State Cache]
        OrganizerSpace & StudentSpace & JudgeSpace & MentorSpace --> SocketClient[Socket.IO Real-time Connection]
    end

    subgraph "External Backend & Cloud Services"
        QueryClient -->|REST API + Axios Interceptors| BE[NestJS Backend API]
        SocketClient -->|WebSocket Channel: user-userId| BE
        OrganizerSpace -->|Direct Upload| S3[AWS S3 Storage via Presigned URLs]
    end
```

---

## ⚡ Core Technical Features & Engineering Highlights

### 1. Advanced State Management & In-Place Cache Mutation
* **Dual-Tier State Architecture:** Uses **Zustand** for lightweight client-side global state (auth tokens, current active role, persistent theme) and **TanStack Query v5** for server-side asynchronous query management.
* **In-Place Query Cache Modification:** Implements `queryClient.setQueryData()` to update React Query cache in memory upon successful mutations (e.g. updating round submission deadline). Enables **0ms instant UI countdown timer recalculation** (`Time left`) without triggering full page reloads or layout flashes.

### 2. Silent Auth Refresh & Role-Based Route Protection (RBAC)
* **Transparent Token Refresh Interceptor:** Axios instance interceptor traps `401 Unauthorized` responses, queues pending network requests, triggers silent token renewal via `HttpOnly Cookie`, and automatically retries queued requests invisibly to the user.
* **Middleware Route Guards:** Next.js Middleware checks user JWT roles (`Role.ORGANIZER`, `Role.STUDENT`, `Role.JUDGE`, `Role.MENTOR`) before rendering layout segments, preventing unauthorized route access at the edge level.

### 3. Real-Time Socket Synchronization & Toast Notifications
* **Custom WebSocket Client (`useAdminSocket`):** Subscribes users dynamically to dedicated socket rooms (`user-${userId}`, `admin-event-${eventId}`, `admin-round-${roundId}`).
* **Click-to-Dismiss Toast Notifications:** Listens to `notification.new` WebSocket events and renders custom `notistack` toasts with `persist: true` (persists until user dismissal) and clean concise title formatting, while simultaneously triggering `invalidateQueries()` to update the unread notification badge count.

### 4. Direct Cloud Uploads (AWS S3 Presigned URLs)
* Handles large team submission artifacts by requesting 5-minute signed Presigned URLs from the NestJS Backend and issuing direct `PUT` uploads from client to AWS S3 buckets. Eliminates backend payload bottlenecks.

### 5. Premium Glassmorphism Aesthetics & Inclusive UI Controls
* **Design System Tokens:** Custom HSL color palettes, subtle borders (`border-border`), and backdrop-blur glassmorphism effects (`GlassCard`) create a dark-mode luxury aesthetic.
* **Disabled State Safeguards & Accessible Tooltips:** Actions restricted by round status (e.g. Bulk Reminder or Deadline Editing when round status is not `open`) are visually disabled (`disabled:opacity-40`) and provide informative native hover tooltips.

---

## 🛠️ Technology Stack & Dependencies

| Category | Technology | Usage / Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server-side rendering, RSC & route management |
| **UI Library** | React 19 | UI component model & hooks |
| **State Management** | TanStack Query v5 + Zustand | Server state caching & lightweight client state |
| **Styling** | TailwindCSS + Radix UI | Utility-first CSS & accessible unstyled primitives |
| **Real-time** | Socket.IO Client | Real-time WebSocket event connection |
| **Icons & Effects** | Lucide React + Framer Motion | Modern iconography & micro-animations |
| **Notifications** | Notistack | Stackable toast notification engine |

---

## 📂 Repository Directory Structure

```
FE/
├── app/                        # Next.js 16 App Router Pages & Layouts
│   ├── (auth)/                 # Login, Register, Password Reset routes
│   ├── admin/                  # System Admin Dashboard
│   ├── judge/                  # Judge Evaluation Workspaces & Leaderboards
│   ├── mentor/                 # Mentor Advisory & Team Feedback Hubs
│   ├── organizer/              # Event Organizer Management Panels & Round Workspaces
│   ├── student/                # Student Workspace & Team Submission Pages
│   └── layout.tsx              # Root Layout with Theme & Query Providers
├── components/                 # Reusable Component Library
│   ├── layout/                 # Topbar, Header, NotificationsMenu, Sidebar
│   ├── providers/              # React Query Provider, SseProvider, ThemeProvider
│   └── ui/                     # GlassCard, Button, Dialog, Tabs, Inputs
├── hooks/                      # Custom React Hooks (useAdminSocket, useSocket)
├── lib/                        # Axios instance, Auth Stores, Utility helpers
├── public/                     # Static assets & brand logos
├── package.json
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites
* Node.js v18+ or v20+
* Running NestJS Backend API (default `http://localhost:3000/api`)

### 1. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to view the application.

### 4. Build Production Bundle
```bash
npm run build
npm run start
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
