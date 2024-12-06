extends Node

static func find_index(nodes: Array[MapNode], pos: Vector2) -> int:
	for i in range(nodes.size()):
		var node = nodes[i]
		if node.position == pos:
			return i
	return -1

static func create_circle(pos: Vector2, id: int, color: Color = preload("res://src/constants/board_constants.gd").CIRCLE_COLOR) -> Node2D:
	var circle = Node2D.new()
	circle.position = pos
	
	# Create a draw function
	var draw_circle = func():
		circle.draw_circle(Vector2.ZERO, 10, color)
		# Draw the ID
		var label = Label.new()
		label.text = str(id)
		label.position = Vector2(-5, -5)  # Adjust position to center the label on the circle
		label.add_to_group("circle_label")
		circle.add_child(label)
	
	circle.draw.connect(draw_circle)
	return circle

static func create_line(start_pos: Vector2, end_pos: Vector2, color: Color = preload("res://src/constants/board_constants.gd").LINE_COLOR) -> Node2D:
	var line = Node2D.new()
	
	# Create a draw function
	var draw_line = func():
		var local_start = start_pos - line.position
		var local_end = end_pos - line.position
		line.draw_line(local_start, local_end, color, preload("res://src/constants/board_constants.gd").LINE_WIDTH)
	
	line.position = (start_pos + end_pos) / 2
	line.draw.connect(draw_line)
	return line
