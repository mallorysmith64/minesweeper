# 💣 Mine Express

A Minesweeper-like game with a twist: some mines are volatile **chain mines** 🌵 that detonate their neighbors when triggered, setting off a chain reaction.

## Technologies

- React.js, JavaScript, Flask, Python, Redis, Terraform, HTML, CSS

## Features

- **Classic Minesweeper gameplay** — left-click to reveal a cell, right-click to flag a suspected mine

- **Three difficulty levels**
  | Difficulty | Grid Size | Mines |

  |---|---|---|
  | Easy | 8x8 | 10 |
  | Medium | 12x12 | 40 |
  | Hard | 16x16 | 100 |

- **Chain mines 🌵** — a portion of the mines on each difficulty (10% Easy, 15% Medium, 25% Hard) are "volatile." Trigger one and it sets off any neighboring mines, which can cascade further if they're chain mines too.

- **Safe start** — you can't lose on any of your first 3 clicks; if you click a mine early on, it's silently relocated elsewhere on the board.

- **Flood fill** — revealing an empty cell automatically reveals its connected empty neighbors, just like classic Minesweeper.

- Simple win/loss detection with a reset button to start a new game at any time.

## Project Structure

```bash
mine-express/
├── backend/
│   └── app.py            # Flask API, game logic, and board state
└── frontend/
    └── src/
        ├── GameBoard.js   # Main game component (state, API calls, difficulty)
        ├── Cell.js        # Individual board cell component
        └── index.css      # Board and cell styling
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js and npm

### Backend Setup

1. Navigate to the backend directory and install dependencies:

   ```bash
   pip install flask flask-cors
   ```

2. Run the server:

   ```bash
   python app.py
   ```

   The API will start on `http://localhost:5000` by default (or the port set by the `PORT` environment variable).

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the frontend root and point it at your backend:

   ```bash
   REACT_APP_API_URL=http://localhost:5000
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`.

### Environment Variables

| Variable | Where | Description |

|---|---|---|
| `PORT` | Backend | Port the Flask server listens on (defaults to `5000`) |
| `FRONTEND_URL` | Backend | Public URL of the deployed frontend, used to restrict CORS in production. Falls back to allowing all origins if unset |
| `REACT_APP_API_URL` | Frontend | URL of the backend API (set at build time) |

## API Endpoints

| Method | Endpoint | Description |

|---|---|---|
| `POST` | `/games` | Create a new game. Body: `{ "difficulty": 0 \| 1 \| 2 }` |
| `GET` | `/games/<game_id>` | Get the current state of a game |
| `POST` | `/games/<game_id>/check` | Reveal a cell. Body: `{ "row": int, "col": int }` |
| `POST` | `/games/<game_id>/flag` | Toggle a flag on a cell. Body: `{ "row": int, "col": int }` |
| `GET` | `/health` | Health check |

Game state is currently stored in-memory on the backend, so games will reset if the server restarts.

## How Chain Mines Work

Each difficulty has a set fraction of its mines flagged as "chain mines." When a chain mine is revealed (i.e., you hit it and lose), the game spreads outward through all adjacent cells:

- Any regular mine caught in the blast radius is revealed (it explodes but doesn't spread further).

- Any chain mine caught in the blast radius also explodes **and** continues propagating the chain reaction from its own position.

This means one wrong click near a chain mine can reveal a whole cluster of mines at once.

## Deployment Notes

The backend reads `FRONTEND_URL` to lock down CORS to your deployed frontend's origin (e.g., a Cloud Run URL) instead of allowing all origins, which is the default for local development. The frontend reads its backend URL from `REACT_APP_API_URL` at build time, so make sure this is set correctly before building for production.

## License

This project is licensed under the [MIT License](LICENSE).
