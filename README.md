# Cartpanda – Upsell Funnel Builder

This project is a **visual drag-and-drop upsell funnel builder** created as part of the Cartpanda Frontend Engineer practical task.

It focuses on building a clean and usable **visual editor only**, without any backend or authentication.

---

## What it does

- Drag and drop funnel pages onto a canvas  
- Connect pages visually (Sales → Order → Upsell → Downsell → Thank You)
- Supported page types:
  - Sales Page
  - Order Page
  - Upsell
  - Downsell
  - Thank You
- Undo / Redo actions
- Delete selected nodes
- Clear the canvas (with confirmation)
- Import funnel from JSON
- Export funnel as JSON

---

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Flow

---

## Running the project locally

Make sure you have Node.js installed.

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/gagandeepgambhir2/cartpanda-funnel

# Step 2: Navigate to the project directory.
cd cartpanda-funnel

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
