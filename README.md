# Ragnarok Online Trivia Game

A web-based trivia game about Ragnarok Online, featuring a monster database with pagination, three trivia game modes, and full monster profiles.

## Features

- **Monster Database**: Browse all monsters from the Ragnarok Online database with pagination
- **Three Trivia Games**:
  - **Guess the Monster**: Identify monsters from their sprites
  - **True or False**: Answer element/resistance questions about monsters
  - **Item Drops**: Match items to the monsters that drop them
- **Monster Details**: View complete information including attributes, elements, resistances, drops, modes, and spawning maps
- **Responsive Design**: Works well on mobile and desktop

## Tech Stack

- **React 19** with React Router for navigation
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **sql.js** for in-browser SQLite database

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

- `/` - Home page with links to trivia games and database
- `/db` - Monster database with pagination
- `/db/:id` - Detailed monster profile with attributes, resistances, drops, modes, and spawning maps
- `/trivia/name` - Guess the Monster trivia game
- `/trivia/facts` - True or False trivia game
- `/trivia/drops` - Item Drops trivia game