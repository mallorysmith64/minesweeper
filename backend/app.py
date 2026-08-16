from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import uuid

app = Flask(__name__)
CORS(app)

# Game difficulties: (rows, cols, mines)
DIFFICULTIES = {
    0: (8, 8, 10),      # Easy
    1: (12, 12, 40),    # Medium
    2: (16, 16, 100)    # Hard
}

# Fraction of mines on each difficulty that are volatile "chain mines" -
# hitting one detonates its neighbors too, and the reaction keeps
# spreading through any chain mines it touches.
CHAIN_MINE_RATIO = {
    0: 0.10,   # Easy - rare, low-stakes intro to the mechanic
    1: 0.15,   # Medium
    2: 0.25    # Hard - riskier, not just bigger
}

# Store active games in memory
games = {}

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

class MinesweeperGame:
    def __init__(self, difficulty=0):
        self.id = str(uuid.uuid4())
        self.difficulty = difficulty
        rows, cols, mines = DIFFICULTIES.get(difficulty, DIFFICULTIES[0])
        self.rows = rows
        self.cols = cols
        self.num_mines = mines
        
        # Initialize boards
        self.board = [[0 for _ in range(cols)] for _ in range(rows)]
        self.revealed = [[False for _ in range(cols)] for _ in range(rows)]
        self.flagged = [[False for _ in range(cols)] for _ in range(rows)]
        self.state = 'playing'
        self.click_count = 0
        
        # Place mines
        self._place_mines()
        # Pick which mines are volatile "chain mines"
        self.chain_mines = self._select_chain_mines()
        # Calculate numbers
        self._calculate_numbers()
    
    def _place_mines(self):
        """Randomly place mines on the board"""
        mines_placed = 0
        while mines_placed < self.num_mines:
            row = random.randint(0, self.rows - 1)
            col = random.randint(0, self.cols - 1)
            if self.board[row][col] != 'M':
                self.board[row][col] = 'M'
                mines_placed += 1

    def _select_chain_mines(self):
        """Pick a subset of the placed mines to be volatile chain mines."""
        mine_cells = [
            (r, c)
            for r in range(self.rows)
            for c in range(self.cols)
            if self.board[r][c] == 'M'
        ]
        ratio = CHAIN_MINE_RATIO.get(self.difficulty, 0.15)
        num_chain = max(1, round(len(mine_cells) * ratio))
        return set(random.sample(mine_cells, num_chain))

    def _relocate_mine(self, row, col):
        """Move a mine off a just-clicked cell to somewhere safe, so it
        doesn't count as a loss. Only used during the first-3-clicks
        safety window. Avoids cells that are already revealed, so a
        mine never silently lands under a spot the player has already
        seen as safe."""
        candidates = [
            (r, c)
            for r in range(self.rows)
            for c in range(self.cols)
            if self.board[r][c] != 'M'
            and not self.revealed[r][c]
            and (r, c) != (row, col)
        ]
        if not candidates:
            return  # board too small/full of mines to relocate - keep as-is

        new_row, new_col = random.choice(candidates)
        self.board[new_row][new_col] = 'M'
        self.board[row][col] = 0  # placeholder, corrected by recalculation below

        # The mine keeps its chain-mine status as it moves
        if (row, col) in self.chain_mines:
            self.chain_mines.discard((row, col))
            self.chain_mines.add((new_row, new_col))

        # Mine positions changed, so every adjacency count needs redoing
        self._calculate_numbers()
    
    def _calculate_numbers(self):
        """Calculate numbers for non-mine cells"""
        for i in range(self.rows):
            for j in range(self.cols):
                if self.board[i][j] != 'M':
                    count = self._count_adjacent_mines(i, j)
                    self.board[i][j] = count
    
    def _count_adjacent_mines(self, row, col):
        """Count mines adjacent to a cell"""
        count = 0
        for i in range(max(0, row - 1), min(self.rows, row + 2)):
            for j in range(max(0, col - 1), min(self.cols, col + 2)):
                if self.board[i][j] == 'M':
                    count += 1
        return count
    
    def _get_display_board(self):
        """Return the board as it should be displayed to the player"""
        display = []
        for i in range(self.rows):
            row = []
            for j in range(self.cols):
                if self.flagged[i][j]:
                    row.append('🚩')
                elif not self.revealed[i][j]:
                    row.append('□')
                elif self.board[i][j] == 'M':
                    row.append('🌵' if (i, j) in self.chain_mines else '💣')
                elif self.board[i][j] == 0:
                    row.append('0')
                else:
                    row.append(str(self.board[i][j]))
            display.append(row)
        return display
    
    def check_cell(self, row, col):
        """Reveal a cell (left click)"""
        if self.state != 'playing':
            return False

        if not (0 <= row < self.rows and 0 <= col < self.cols):
            return False
        
        if self.revealed[row][col] or self.flagged[row][col]:
            return False
        
        self.click_count += 1

        # Guarantee the player can't lose on any of their first 3 clicks,
        # regardless of difficulty - move the mine elsewhere instead.
        if self.board[row][col] == 'M' and self.click_count <= 3:
            self._relocate_mine(row, col)

        # Hit a mine - game over
        if self.board[row][col] == 'M':
            self.state = 'lost'
            self.revealed[row][col] = True
            if (row, col) in self.chain_mines:
                self._detonate_chain(row, col)
            return False
        
        # Reveal the cell
        self.revealed[row][col] = True
        
        # If it's a 0, reveal all adjacent cells (flood fill)
        if self.board[row][col] == 0:
            self._flood_fill(row, col)
        
        # Check if player won
        if self._check_win():
            self.state = 'won'
        
        return True
    
    def _flood_fill(self, row, col):
        """Reveal all adjacent cells if current cell is 0"""
        for i in range(max(0, row - 1), min(self.rows, row + 2)):
            for j in range(max(0, col - 1), min(self.cols, col + 2)):
                if (
                    not self.revealed[i][j]
                    and not self.flagged[i][j]
                    and self.board[i][j] != 'M'
                ):
                    self.revealed[i][j] = True
                    if self.board[i][j] == 0:
                        self._flood_fill(i, j)

    def _detonate_chain(self, row, col):
        """Spread outward from a chain mine, revealing (exploding) any
        mine it touches. If that mine is also a chain mine, the
        explosion keeps propagating from there. Regular mines catch
        the blast but don't pass it on."""
        frontier = [(row, col)]
        visited = {(row, col)}
        while frontier:
            r, c = frontier.pop()
            for i in range(max(0, r - 1), min(self.rows, r + 2)):
                for j in range(max(0, c - 1), min(self.cols, c + 2)):
                    if (i, j) in visited:
                        continue
                    visited.add((i, j))
                    if self.board[i][j] == 'M':
                        self.revealed[i][j] = True
                        if (i, j) in self.chain_mines:
                            frontier.append((i, j))
    
    def _check_win(self):
        """Check if player has won (all non-mine cells revealed)"""
        for i in range(self.rows):
            for j in range(self.cols):
                if self.board[i][j] != 'M' and not self.revealed[i][j]:
                    return False
        return True
    
    def flag_cell(self, row, col):
        """Toggle flag on a cell (right click)"""
        if self.state != 'playing':
            return False

        if not (0 <= row < self.rows and 0 <= col < self.cols):
            return False
        
        if self.revealed[row][col]:
            return False
        
        self.flagged[row][col] = not self.flagged[row][col]
        return True
    
    def to_dict(self):
        """Convert game to JSON-serializable dict"""
        return {
            'id': self.id,
            'board': self._get_display_board(),
            'state': self.state,
            'difficulty': self.difficulty
        }


# API ENDPOINTS

@app.route('/games', methods=['POST'])
def create_game():
    """Create a new game"""
    data = request.get_json()
    difficulty = data.get('difficulty', 0)
    
    # Validate difficulty
    if difficulty not in DIFFICULTIES:
        difficulty = 0
    
    game = MinesweeperGame(difficulty)
    games[game.id] = game
    
    return jsonify(game.to_dict()), 201


@app.route('/games/<game_id>/check', methods=['POST'])
def check_cell(game_id):
    """Check/reveal a cell"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    data = request.get_json()
    row = data.get('row')
    col = data.get('col')
    
    if row is None or col is None:
        return jsonify({'error': 'Missing row or col'}), 400
    
    game = games[game_id]
    game.check_cell(row, col)
    
    return jsonify(game.to_dict()), 200


@app.route('/games/<game_id>/flag', methods=['POST'])
def flag_cell(game_id):
    """Flag/unflag a cell"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    data = request.get_json()
    row = data.get('row')
    col = data.get('col')
    
    if row is None or col is None:
        return jsonify({'error': 'Missing row or col'}), 400
    
    game = games[game_id]
    game.flag_cell(row, col)
    
    return jsonify(game.to_dict()), 200


@app.route('/games/<game_id>', methods=['GET'])
def get_game(game_id):
    """Get current game state"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    game = games[game_id]
    return jsonify(game.to_dict()), 200


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)