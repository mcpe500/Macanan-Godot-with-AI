# papan.gd
extends Node2D

# Game configuration
var game_config = {
	"mode": "pvp",
	"game_type": "21v1",
	"ai_difficulty": "normal",
	"player_side": "uwong"
}

# Game state
var board = []
var current_player = "uwong"
var game_over = false
var uwong_hand = 12  # Number of Uwong pieces left in hand for 21v1
var uwong_pieces_on_board = 0  # Number of Uwong pieces on the board for 21v1

# Constants for the game
const MAX_UWONG_21V1 = 12
const MAX_UWONG_8V2 = 8
const MAX_MACAN_21V1 = 1
const MAX_MACAN_8V2 = 2

# Initialize the game
func _ready() -> void:
	# Initialize the game with the passed game configuration
	if $Node2D.game_config:
		game_config = $Node2D.game_config
	initialize_board()
	setup_game()

func initialize_board() -> void:
	# Initialize the board with empty positions
	for i in range(9):
		var row = []
		for j in range(9):
			row.append(null)
		board.append(row)

func setup_game() -> void:
	# Place initial Uwong pieces for 21v1
	if game_config.game_type == "21v1":
		place_initial_uwong_21v1()
		current_player = "macan"
		place_initial_macan_21v1()
	else:
		# Place initial Uwong and Macan pieces for 8v2
		place_initial_uwong_8v2()
		place_initial_macan_8v2()
		current_player = "uwong"

func place_initial_uwong_21v1() -> void:
	# Place 9 Uwong pieces in a 3x3 square
	var start_x = 3
	var start_y = 3
	for i in range(3):
		for j in range(3):
			board[start_x + i][start_y + j] = {"type": "uwong", "pos": Vector2(start_x + i, start_y + j)}
			uwong_pieces_on_board += 1

func place_initial_macan_21v1() -> void:
	# Place 1 Macan piece
	var macan_pos = Vector2(0, 0)  # Example position, can be randomized or chosen by the player
	board[macan_pos.x][macan_pos.y] = {"type": "macan", "pos": macan_pos}

func place_initial_uwong_8v2() -> void:
	# Place 8 Uwong pieces one by one
	for i in range(8):
		# Example positions, can be chosen by the player
		var uwong_pos = Vector2(i % 8, i // 8)
		board[uwong_pos.x][uwong_pos.y] = {"type": "uwong", "pos": uwong_pos}

func place_initial_macan_8v2() -> void:
	# Place 2 Macan pieces one by one
	for i in range(2):
		# Example positions, can be chosen by the player
		var macan_pos = Vector2(8 - i, 8 - i)
		board[macan_pos.x][macan_pos.y] = {"type": "macan", "pos": macan_pos}

func _process(delta: float) -> void:
	if game_over:
		return

	# Handle player input or AI turn based on the game mode
	if game_config.mode == "pvp":
		handle_player_turn()
	elif game_config.mode == "pva":
		if current_player == "uwong":
			handle_player_turn()
		else:
			handle_ai_turn("macan")
	elif game_config.mode == "aip":
		if current_player == "macan":
			handle_player_turn()
		else:
			handle_ai_turn("uwong")
	elif game_config.mode == "aiai":
		handle_ai_turn(current_player)

func handle_player_turn() -> void:
	# Handle player input (e.g., mouse clicks, key presses)
	var input_pos = get_input_position()
	if input_pos:
		if is_valid_move(input_pos):
			make_move(input_pos)
			switch_player()

func get_input_position() -> Vector2:
	# Get the position of the mouse click on the board
	if Input.is_action_just_pressed("ui_select"):
		var mouse_pos = get_global_mouse_position()
		var board_pos = screen_to_board_position(mouse_pos)
		if is_valid_board_position(board_pos):
			return board_pos
	return null

func screen_to_board_position(screen_pos: Vector2) -> Vector2:
	# Convert screen position to board position
	# Assuming a 9x9 grid with a fixed size, adjust the conversion based on your actual layout
	var cell_size = 50  # Example cell size
	var board_offset = Vector2(50, 50)  # Example board offset
	var board_pos = (screen_pos - board_offset) / cell_size
	return board_pos.floor()

func is_valid_board_position(pos: Vector2) -> bool:
	# Check if the position is within the board bounds
	return pos.x >= 0 and pos.x < 9 and pos.y >= 0 and pos.y < 9

func is_valid_move(pos: Vector2) -> bool:
	# Check if the move is valid based on the current player and game rules
	if current_player == "uwong":
		if game_config.game_type == "21v1":
			if uwong_hand > 0:
				# Check if the position is vacant for placing a new Uwong piece
				return board[pos.x][pos.y] == null
			else:
				# Check if the move is a valid move for an existing Uwong piece
				return is_valid_uwong_move(pos)
		elif game_config.game_type == "8v2":
			# Check if the move is a valid move for an existing Uwong piece
			return is_valid_uwong_move(pos)
	elif current_player == "macan":
		if game_config.game_type == "21v1":
			# Check if the move is a valid move for the Macan piece
			return is_valid_macan_move(pos)
		elif game_config.game_type == "8v2":
			# Check if the move is a valid move for one of the Macan pieces
			return is_valid_macan_move(pos)
	return false

func is_valid_uwong_move(pos: Vector2) -> bool:
	# Check if the move is a valid move for an existing Uwong piece
	for i in range(9):
		for j in range(9):
			if board[i][j] and board[i][j].type == "uwong":
				if is_adjacent(Vector2(i, j), pos) and board[pos.x][pos.y] == null:
					return true
	return false

func is_valid_macan_move(pos: Vector2) -> bool:
	# Check if the move is a valid move for the Macan piece
	for i in range(9):
		for j in range(9):
			if board[i][j] and board[i][j].type == "macan":
				if is_adjacent(Vector2(i, j), pos) and board[pos.x][pos.y] == null:
					return true
				if is_valid_jump(Vector2(i, j), pos):
					return true
	return false

func is_adjacent(pos1: Vector2, pos2: Vector2) -> bool:
	# Check if two positions are adjacent (horizontally, vertically, or diagonally)
	return abs(pos1.x - pos2.x) <= 1 and abs(pos1.y - pos2.y) <= 1 and pos1 != pos2

func is_valid_jump(start_pos: Vector2, end_pos: Vector2) -> bool:
	# Check if the jump is valid based on the game type
	var direction = (end_pos - start_pos).normalized()
	var current_pos = start_pos + direction
	var jump_count = 0
	var pieces_to_capture = []

	while current_pos != end_pos:
		if board[current_pos.x][current_pos.y] and board[current_pos.x][current_pos.y].type == "uwong":
			jump_count += 1
			pieces_to_capture.append(current_pos)
		current_pos += direction

	if game_config.game_type == "21v1":
		return jump_count % 2 == 1 and board[end_pos.x][end_pos.y] == null
	elif game_config.game_type == "8v2":
		return jump_count % 2 == 0 and board[end_pos.x][end_pos.y] == null
	return false

func make_move(move: Vector2) -> void:
	# Apply the move to the board
	if current_player == "uwong":
		if game_config.game_type == "21v1":
			if uwong_hand > 0:
				# Place a new Uwong piece
				board[move.x][move.y] = {"type": "uwong", "pos": move}
				uwong_hand -= 1
				uwong_pieces_on_board += 1
			else:
				# Move an existing Uwong piece
				move_uwong_piece(move)
		elif game_config.game_type == "8v2":
			# Move an existing Uwong piece
			move_uwong_piece(move)
	elif current_player == "macan":
		if game_config.game_type == "21v1":
			# Move the Macan piece
			move_macan_piece(move)
		elif game_config.game_type == "8v2":
			# Move one of the Macan pieces
			move_macan_piece(move)

func move_uwong_piece(move: Vector2) -> void:
	# Find the Uwong piece to move
	for i in range(9):
		for j in range(9):
			if board[i][j] and board[i][j].type == "uwong" and is_adjacent(Vector2(i, j), move):
				board[i][j] = null
				board[move.x][move.y] = {"type": "uwong", "pos": move}
				return

func move_macan_piece(move: Vector2) -> void:
	# Find the Macan piece to move
	for i in range(9):
		for j in range(9):
			if board[i][j] and board[i][j].type == "macan":
				if is_adjacent(Vector2(i, j), move) or is_valid_jump(Vector2(i, j), move):
					board[i][j] = null
					board[move.x][move.y] = {"type": "macan", "pos": move}
					if is_valid_jump(Vector2(i, j), move):
						capture_uwong_pieces(Vector2(i, j), move)
					return

func capture_uwong_pieces(start_pos: Vector2, end_pos: Vector2) -> void:
	# Capture Uwong pieces during a jump
	var direction = (end_pos - start_pos).normalized()
	var current_pos = start_pos + direction
	while current_pos != end_pos:
		if board[current_pos.x][current_pos.y] and board[current_pos.x][current_pos.y].type == "uwong":
			board[current_pos.x][current_pos.y] = null
			if game_config.game_type == "21v1":
				uwong_pieces_on_board -= 1
		current_pos += direction

func switch_player() -> void:
	# Switch the current player
	current_player = "uwong" if current_player == "macan" else "macan"
	game_over_check()

func game_over_check() -> void:
	# Check if the game is over
	if game_config.game_type == "21v1":
		if uwong_pieces_on_board == 0 or not can_uwong_move():
			game_over = true
			print("Macan wins!")
		elif not can_macan_move():
			game_over = true
			print("Uwong wins!")
	elif game_config.game_type == "8v2":
		if not can_uwong_move():
			game_over = true
			print("Macan wins!")
		elif not can_macan_move():
			game_over = true
			print("Uwong wins!")

func can_uwong_move() -> bool:
	# Check if any Uwong piece can move
	for i in range(9):
		for j in range(9):
			if board[i][j] and board[i][j].type == "uwong":
				for dx in [-1, 0, 1]:
					for dy in [-1, 0, 1]:
						if is_valid_move(Vector2(i + dx, j + dy)):
							return true
	return false

func can_macan_move() -> bool:
	# Check if any Macan piece can move
	for i in range(9):
		for j in range(9):
			if board[i][j] and board[i][j].type == "macan":
				for dx in [-1, 0, 1]:
					for dy in [-1, 0, 1]:
						if is_valid_move(Vector2(i + dx, j + dy)):
							return true
	return false
