# Ragnarok Online Trivia Game

A web-based trivia game about Ragnarok Online, featuring a monster database with detailed information, pagination, and full monster profiles.

## Features

- **Monster Database**: Browse all monsters from the Ragnarok Online database
- **Pagination**: Navigate through monsters 20 at a time
- **Monster Details**: View complete information including attributes, elements, resistances, drops, modes, and spawning maps
- **Responsive Design**: Works well on mobile and desktop

## Tech Stack

- **React 19** with React Router for navigation
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **sql.js** for in-browser SQLite database
- **React Compiler** not enabled (performance impact)

## Available Scripts

| Command | Description |
|---------|-------------|
| `dev` | Starts the development server at `http://localhost:5000` |
| `build` | Builds the production app |
| `lint` | Runs ESLint to check for code issues |
| `preview` | Preview the production build locally |

## Database

The monster data is loaded from `assets/monsters.db` using sql.js WASM. The database contains Ragnarok Online monster information including stats, elements, resistances, drops, and spawning locations.

## Page Structure

- `/` - Home page with link to the database
- `/db` - Monster database with pagination and search
- `/db/:id` - Detailed monster profile with attributes, resistances, drops, and more