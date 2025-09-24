# Acceptance Criteria: Audience Store

This document provides a checklist of testable criteria to verify that the application meets the requirements defined in the PRD and technical specification.

---

### Milestone 1: Project Setup & Data Model

*Goal: The project is initialized, the database is set up with seed data, and the application is runnable.*

- [ ] **Local Environment**: The application starts without errors when running `pnpm dev`.
- [ ] **Database Schema**: Running `pnpm prisma db push` successfully creates the `User`, `Audience`, and `Transaction` tables in the `dev.db` SQLite database.
- [ ] **Seed Data**: The seed script successfully populates the database with at least two users and three audiences.
- [ ] **Data Integrity**: At least one seeded audience has `isForSale` set to `true`, and at least one has it set to `false`.

---

### Milestone 2: Marketplace View

*Goal: The homepage displays all available audiences for purchase.*

- [ ] **Page Load**: The homepage (`/`) loads successfully.
- [ ] **API Call**: The page makes a `GET` request to `/api/audiences` and receives a `200 OK` status with a JSON array of audiences.
- [ ] **Display Logic**: The homepage grid displays *only* the audiences where `isForSale` is `true`.
- [ ] **Card Content**: Each `AudienceCard` correctly displays the audience's name, price, and the current owner's name.
- [ ] **Navigation**: Clicking on an `AudienceCard` navigates the user to the corresponding `/audience/[id]` page.
- [ ] **Header**: The main `Header` component is visible on the page, showing the application title and a placeholder for the user's balance.
- [ ] **Edge Case (Empty Marketplace)**: If all audiences in the database have `isForSale: false`, the marketplace page loads and displays a message indicating that no items are for sale.

---

### Milestone 3: Transactions

*Goal: A user can successfully and safely purchase an audience.*

- [ ] **Detail Page**: The audience detail page (`/audience/[id]`) loads and displays the correct audience name, description, and price.
- [ ] **Successful Purchase**:
    - [ ] A user with sufficient balance clicks the "Purchase" button.
    - [ ] A `POST` request is sent to `/api/transactions` with the correct `audienceId` and `buyerId`.
    - [ ] The API returns a `200 OK` or `201 Created` status.
    - [ ] **DB Check**: The buyer's `balance` in the `User` table is debited by the audience `price`.
    - [ ] **DB Check**: The seller's `balance` is credited by the audience `price`.
    - [ ] **DB Check**: The `ownerId` on the `Audience` record is updated to the buyer's ID.
    - [ ] **DB Check**: The `isForSale` flag on the `Audience` record is set to `false`.
    - [ ] **DB Check**: A new record is created in the `Transaction` table linking the buyer and the audience.
- [ ] **UI Feedback (Post-Purchase)**:
    - [ ] After a successful purchase, the user is shown a success message.
    - [ ] The purchased audience is no longer visible on the main marketplace page (`/`).
- [ ] **Edge Case (Insufficient Credits)**:
    - [ ] A user attempts to buy an audience with a `price` greater than their `balance`.
    - [ ] The `POST /api/transactions` request fails with a `400` or `409` status code and a clear error message (e.g., "Insufficient credits").
    - [ ] The UI displays a user-friendly error message.
    - [ ] **DB Check**: No changes are made to `User`, `Audience`, or `Transaction` tables.
- [ ] **Edge Case (Item Already Sold)**:
    - [ ] A user attempts to buy an audience where `isForSale` is `false`.
    - [ ] The `POST /api/transactions` request fails with a `409 Conflict` status code and a clear error message (e.g., "Item is not for sale").
    - [ ] The UI displays a user-friendly error message.
    - [ ] **DB Check**: No changes are made to `User`, `Audience`, or `Transaction` tables.
- [ ] **UI State**: The "Purchase" button is disabled and shows a loading indicator while the transaction request is pending.

---

### Milestone 4: User Account Page

*Goal: The user can view their balance and owned assets.*

- [ ] **Page Load**: The account page (`/account`) loads successfully for a simulated logged-in user.
- [ ] **Balance Display**: The page correctly displays the user's current `balance`.
- [ ] **Owned Audiences**: The page displays a list of audiences where the `ownerId` matches the user's ID.
- [ ] **Header Balance**: The `Header` component, visible across all pages, displays the user's current `balance`.
- [ ] **Real-time Update**: After a user purchases an audience, the balance displayed in the `Header` and on the `/account` page updates to reflect the new, lower balance without requiring a manual page refresh.

---

### Milestone 5: (Optional) AI-Generated Descriptions

*Goal: A user can leverage AI to generate a description for an audience.*

- [ ] **UI Element**: A "Generate Description" button or similar UI element is present in the "Create Audience" form/UI.
- [ ] **API Call**: Clicking the button triggers a `POST` request to a dedicated API route (e.g., `/api/generate-description`) with the audience name as the payload.
- [ ] **API Response**: The API route returns a `200 OK` status with a JSON object containing the generated text (e.g., `{ "description": "..." }`).
- [ ] **UI Update**: The description `textarea` or input field in the form is populated with the text returned from the API.

---

### Deployment Readiness

*Goal: The application is ready for production deployment.*

- [ ] **Build**: The application builds successfully without errors using the `pnpm build` command.
- [ ] **Linting**: The code passes all linting checks (`pnpm lint` or equivalent).
- [ ] **Deployment**: The application can be successfully deployed to a target platform (e.g., Vercel, GitHub Codespaces) and remains functional.