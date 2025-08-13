# Post Viewer

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

A small React project to display posts in masonry layout with images, user info, and a like feature. Uses **React**, **TailwindCSS**, **React Query**, and **Zustand** for state management.  

---

## Features

- Fetch posts from a placeholder API  
- Display post images, title, and user avatar  
- Like/unlike posts with **animation**  
- Like count updates **optimistically**  
- Global state management with **Zustand**  
- Responsive layout using **TailwindCSS columns**  
- Skeleton loading placeholders while fetching posts  

---

## Tech Stack

- **React** – Frontend library  
- **TailwindCSS** – Styling  
- **React Query** – Data fetching and caching  
- **Zustand** – Global state management  
- **React Icons** – Icons for UI  
- **Picsum.photos** – Placeholder images  

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```
2. Install dependencies:

```bash
pnpm install
# or
npm install
# or
yarn install
```
3. Start the development server:
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

4. Open in browser: http://localhost:5173

## Folder Structure
```bash
src/
 ├─ components/       # Reusable components (PostCard, Icons, etc.)
 ├─ stores/           # Zustand store for post state
 ├─ utils/            # Utility functions (API, image dimensions)
 ├─ pages/            # Main page components
 └─ App.jsx           # Root component
```
## Usage
Click on a post to open the modal (or trigger any action you implement)

Click the heart icon to like/unlike a post

Likes update immediately with a bg-red animation

## Future Improvements
Add infinite scrolling for posts

Add comments and user interactions

Add live chatting function using websocket etc
Persist likes in local storage or backend
