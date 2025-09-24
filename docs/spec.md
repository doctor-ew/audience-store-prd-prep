# Technical Specification: Audience Store

This document translates the PRD for the "Audience Store" into a concrete technical design and implementation plan. It is intended for developers to build the application.

## 1. Architecture Overview

The application will be a full-stack web application built with Next.js and deployed on a platform like Vercel or Netlify.

-   **Framework**: Next.js 14+ with App Router.
-   **Language**: TypeScript.
-   **Database**: SQLite, accessed via Prisma ORM. This is suitable for a single-server, low-concurrency demo environment like GitHub Codespaces.
-   **Styling**: Tailwind CSS for utility-first styling.
-   **Backend Logic**: API logic will be handled by Next.js API Route Handlers within the App Router (`src/app/api/...`).
-   **Frontend Logic**: UI will be built with React Server Components (RSC) for static content and Client Components for interactive elements.

## 2. File Structure

The project will follow the `src` directory convention for Next.js.

```
/
├── prisma/
│   └── schema.prisma         # Prisma data model
├── public/
│   └── ...                   # Static assets
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── audiences/
    │   │   │   ├── route.ts        # GET (all), POST
    │   │   │   └── [id]/
    │   │   │       └── route.ts    # GET (one)
    │   │   └── transactions/
    │   │       └── route.ts        # POST (for purchases)
    │   ├── account/
    │   │   └── page.tsx            # User's profile page
    │   ├── audience/[id]/
    │   │   └── page.tsx            # Audience detail page
    │   ├── globals.css
    │   ├── layout.tsx              # Root layout
    │   └── page.tsx                # Homepage / Marketplace
    ├── components/
    │   ├── ui/                     # ShadCN/UI components (button, card, etc.)
    │   ├── audience-card.tsx
    │   ├── header.tsx
    │   └── purchase-button.tsx
    └── lib/
        ├── prisma.ts               # Prisma client singleton
        └── data.ts                 # Data access functions (e.g., getUser, getAudiences)
```

## 3. Dependencies

-   **`next`**, **`react`**, **`react-dom`**: Core framework.
-   **`prisma`**: ORM for database access.
-   **`@prisma/client`**: The generated database client.
-   **`tailwindcss`**: For styling.
-   **`typescript`**, **`@types/*`**: For static typing.
-   **`pnpm`**: As the package manager.

## 4. Data Model (`prisma/schema.prisma`)

The data model simplifies the PRD's "Product" to "Audience" to match the app's theme. User authentication is out of scope for v1; we will simulate a logged-in user.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id          String        @id @default(cuid())
  email       String        @unique
  name        String?
  balance     Int           @default(100)
  audiences   Audience[]    @relation("OwnedAudiences")
  Transaction Transaction[] @relation("UserTransactions")
}

model Audience {
  id          String        @id @default(cuid())
  name        String
  description String
  price       Int
  ownerId     String
  owner       User          @relation("OwnedAudiences", fields: [ownerId], references: [id])
  isForSale   Boolean       @default(true)
  Transaction Transaction[]
}

model Transaction {
  id         String   @id @default(cuid())
  audienceId String
  audience   Audience @relation(fields: [audienceId], references: [id])
  buyerId    String
  buyer      User     @relation("UserTransactions", fields: [buyerId], references: [id])
  amount     Int
  createdAt  DateTime @default(now())
}
```

## 5. API Routes

All API routes will return JSON with appropriate HTTP status codes.

-   **`GET /api/audiences`**: Fetches all audiences where `isForSale` is `true`.
-   **`GET /api/audiences/[id]`**: Fetches a single audience by its ID.
-   **`POST /api/transactions`**: Handles the purchase of an audience.
    -   **Request Body**: `{ "audienceId": string, "buyerId": string }`
    -   **Logic**: This is the most critical endpoint and must handle the transaction atomically.

## 6. UI Pages and Components

-   **`/` (Marketplace Page)**: Displays a grid of `AudienceCard` components for all available audiences.
-   **`/audience/[id]` (Audience Detail Page)**: Shows details for a single audience and includes the `PurchaseButton`.
-   **`/account` (Account Page)**: Displays the current user's balance and a list of audiences they own.
-   **`Header` (Component)**: Site-wide header showing the app title and a link to the Account page with the user's balance.
-   **`AudienceCard` (Component)**: A card displaying an audience's name, price, and owner.
-   **`PurchaseButton` (Client Component)**: A button that, when clicked, triggers the `POST /api/transactions` request. It should handle loading and disabled states.

## 7. Error Handling & Edge Cases

-   **API Errors**: API routes should use `try/catch` blocks and return meaningful error messages with status codes (e.g., `400` for bad input, `404` for not found, `409` for conflict, `500` for server error).
-   **UI Feedback**: The UI should display clear loading states while fetching data and provide user-friendly error messages on failed actions (e.g., "Not enough credits," "This item was already sold.").
-   **Concurrency Risk**: **Buying an Audience.** Two users could try to buy the same audience simultaneously.
    -   **Mitigation**: The `POST /api/transactions` route **must** use `prisma.$transaction`. The transaction will:
        1.  Read the `Audience` to ensure it is still for sale.
        2.  Read the `User` (buyer) to ensure they have enough `balance`.
        3.  `UPDATE` the buyer's balance (`decrement`).
        4.  `UPDATE` the seller's balance (`increment`).
        5.  `UPDATE` the `Audience` to set `isForSale = false` and change `ownerId` to the buyer.
        6.  Create a `Transaction` record.
    -   If any step fails (e.g., the audience is already sold), the entire transaction will be rolled back by Prisma, preventing data inconsistency.

## 8. Optional/Future Features

-   **AI Witty Descriptions**: This feature is marked as optional for the initial build. It would involve adding a button in the "Create Audience" flow that calls a new API route (e.g., `POST /api/generate-description`). This route would in turn call a third-party AI service (like the Gemini API) and return the generated text to the client.

---

## Work Breakdown & Implementation Plan

This plan is broken into milestones. Each milestone includes a checklist of tasks.

### Milestone 1: Project Setup & Data Model

*Goal: Initialize the project, configure the database, and create the data schema.*

-   [ ] **Task**: Set up Next.js project with `pnpm create next-app`.
-   [ ] **Task**: Install Prisma and initialize it with the SQLite provider.
    -   `pnpm add -D prisma`
    -   `pnpm add @prisma/client`
    -   `pnpm prisma init --datasource-provider sqlite`
-   [ ] **Task**: Define the `User`, `Audience`, and `Transaction` models in `prisma/schema.prisma`.
-   [ ] **Task**: Push the schema to the database to create the tables.
    -   `pnpm prisma db push`
-   [ ] **Task**: Create a script to seed the database with a few sample users and audiences.
    -   *Files to create/edit*: `package.json`, `prisma/schema.prisma`, `scripts/seed.ts`.
-   [ ] **Acceptance Criteria**: The project runs (`pnpm dev`), and the SQLite database contains the correct tables and seed data.

### Milestone 2: Marketplace View

*Goal: Display all available audiences on the homepage.*

-   [ ] **Task**: Create the API route `GET /api/audiences` to fetch all audiences where `isForSale: true`.
-   [ ] **Task**: Create a data access function in `src/lib/data.ts` to fetch audiences, used by the API route.
-   [ ] **Task**: Create the `AudienceCard` component to display audience information.
-   [ ] **Task**: Implement the homepage (`src/app/page.tsx`) to fetch data from the API route and render a list of `AudienceCard` components.
-   [ ] **Task**: Create a basic `Header` component that shows the app title and a placeholder for user balance.
-   [ ] **Files to create/edit**: `src/app/api/audiences/route.ts`, `src/lib/data.ts`, `src/components/audience-card.tsx`, `src/app/page.tsx`, `src/components/header.tsx`.
-   [ ] **Acceptance Criteria**: The homepage successfully loads and displays the seeded audiences that are marked for sale.

### Milestone 3: Transactions

*Goal: Allow a user to purchase an audience.*

-   [ ] **Task**: Create the `PurchaseButton` client component. It will take `audienceId` and `buyerId` as props.
-   [ ] **Task**: Create the audience detail page (`/audience/[id]/page.tsx`) that shows more information about an audience and includes the `PurchaseButton`.
-   [ ] **Task**: Implement the `POST /api/transactions` API route.
    -   **Crucially**, use `prisma.$transaction` to ensure the purchase logic is atomic and handles the concurrency race condition.
-   [ ] **Task**: Add logic to the `PurchaseButton` to call this API, handle loading/disabled states, and show success or error feedback.
-   [ ] **Files to create/edit**: `src/app/audience/[id]/page.tsx`, `src/components/purchase-button.tsx`, `src/app/api/transactions/route.ts`.
-   [ ] **Acceptance Criteria**:
    -   A user can click "Buy" on an audience.
    -   The buyer's balance is debited, and the seller's is credited.
    -   The audience's `ownerId` is updated, and `isForSale` is set to `false`.
    -   The sold audience no longer appears on the main marketplace page.
    -   An attempt to buy an already-sold item fails gracefully.

### Milestone 4: User Account Page

*Goal: Create a page for users to see their assets and balance.*

-   [ ] **Task**: Create the account page at `/account`.
-   [ ] **Task**: The page should display the (currently simulated) user's name, email, and current `balance`.
-   [ ] **Task**: The page should also list the audiences the user owns (i.e., where `ownerId` matches their ID).
-   [ ] **Task**: Update the `Header` to show the user's current balance and link to the account page.
-   [ ] **Files to create/edit**: `src/app/account/page.tsx`, `src/components/header.tsx`.
-   [ ] **Acceptance Criteria**: The `/account` page correctly displays the user's balance and their collection of purchased audiences. The header updates in real-time after a purchase.

### Milestone 5: (Future) AI-Generated Descriptions

*Goal: Integrate an AI model to generate witty descriptions for new audiences.*

-   [ ] **Task**: Design a simple UI form for creating a new audience (name, price).
-   [ ] **Task**: Create a new API route `POST /api/generate-description`.
-   [ ] **Task**: This route will take a prompt (e.g., the audience name) and use a generative AI SDK to produce a description.
-   [ ] **Task**: The UI will call this route and populate the description field with the result.
-   [ ] **Acceptance Criteria**: A user can input an audience name, click a "Generate" button, and receive an AI-generated description in the form.
