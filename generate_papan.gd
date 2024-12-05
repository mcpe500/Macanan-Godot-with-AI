extends Node2D

const BoardConstants = preload("res://board_constants.gd")
const BoardPositions = preload("res://board_positions.gd")

func create_circle(pos: Vector2) -> Node2D:
	var circle = Node2D.new()
	circle.position = pos
	
	var draw_circle = func():
		circle.draw_circle(Vector2.ZERO, 10, BoardConstants.CIRCLE_COLOR)
	
	circle.draw.connect(draw_circle)
	return circle

func create_line(start_pos: Vector2, end_pos: Vector2) -> Node2D:
	var line = Node2D.new()
	
	var draw_line = func():
		var local_start = start_pos - line.position
		var local_end = end_pos - line.position
		line.draw_line(local_start, local_end, BoardConstants.LINE_COLOR, BoardConstants.LINE_WIDTH)
		
	line.position = (start_pos + end_pos) / 2
	line.draw.connect(draw_line)
	return line

func connect_middle_section(papan_place: Node2D, positions: Array) -> void:
	for i in range(25):
		var row = i / 5
		var col = i % 5
		
		# Horizontal connections
		if col < 4:
			papan_place.add_child(create_line(positions[i], positions[i + 1]))
		
		# Vertical connections
		if row < 4:
			papan_place.add_child(create_line(positions[i], positions[i + 5]))
		
		# Diagonal connections (modified to match image)
		if col < 4 and row < 4:
			papan_place.add_child(create_line(positions[i], positions[i + 6]))
			papan_place.add_child(create_line(positions[i + 1], positions[i + 5]))

func connect_triangle_section(papan_place: Node2D, positions: Array, start_idx: int, connections: Array) -> void:
	for conn in connections:
		var start_pos = positions[start_idx + conn[0]]
		var end_pos = positions[start_idx + conn[1]]
		papan_place.add_child(create_line(start_pos, end_pos))

func _ready() -> void:
	var papan_place = get_node("papan_place")
	var positions = []
	
	# Get all positions
	positions.append_array(BoardPositions.get_middle_positions())
	positions.append_array(BoardPositions.get_left_triangle_positions())
	positions.append_array(BoardPositions.get_right_triangle_positions())
	
	# Create all circles
	for pos in positions:
		papan_place.add_child(create_circle(pos))
	
	# Connect middle section
	connect_middle_section(papan_place, positions)
	
	# Left triangle connections
	var left_connections = [
		[25, 26], [26, 27], [27, 28],  # Horizontal
		[29, 30], [30, 31],            # Horizontal second row
		[26, 29], [27, 30], [28, 31],  # Vertical
		[26, 30], [27, 31]             # Diagonal
	]
	
	# Right triangle connections
	var right_connections = [
		[32, 33], [33, 34], [34, 35],  # Horizontal
		[36, 37], [37, 38],            # Horizontal second row
		[33, 36], [34, 37], [35, 38],  # Vertical
		[33, 37], [34, 38]             # Diagonal
	]
	
	# Connect triangles
	connect_triangle_section(papan_place, positions, 0, left_connections)
	connect_triangle_section(papan_place, positions, 0, right_connections)
	
	# Connect triangles to middle section
	# Left side
	papan_place.add_child(create_line(positions[25], positions[5]))   # Top
	papan_place.add_child(create_line(positions[27], positions[10]))  # Middle
	papan_place.add_child(create_line(positions[30], positions[15]))  # Bottom
	
	# Right side
	papan_place.add_child(create_line(positions[32], positions[9]))   # Top
	papan_place.add_child(create_line(positions[34], positions[14]))  # Middle
	papan_place.add_child(create_line(positions[37], positions[19]))  # Bottom
