extends Node2D

const BoardConstants = preload("res://src/constants/board_constants.gd")
const BoardPositions = preload("res://src/constants/board_positions.gd")
const MapNode = preload("res://src/models/MapNode.gd")
const Utils = preload("res://src/utils/utils.gd")

func _ready() -> void:
	var raw_positions = [
		# Row 0
		#Vector2(0, 0), 
		Vector2(2, 0), Vector2(3, 0), Vector2(4, 0), Vector2(5, 0), Vector2(6, 0), 
		#Vector2(8, 0),
		# Row 1
		Vector2(0, 1), Vector2(1, 1), Vector2(2, 1), Vector2(3, 1), Vector2(4, 1), Vector2(5, 1), Vector2(6, 1), Vector2(7, 1), Vector2(8, 1),
		# Row 2
		Vector2(0, 2), Vector2(1, 2), Vector2(2, 2), Vector2(3, 2), Vector2(4, 2), Vector2(5, 2), Vector2(6, 2), Vector2(7, 2), Vector2(8, 2),
		# Row 3
		Vector2(0, 3), Vector2(1, 3), Vector2(2, 3), Vector2(3, 3), Vector2(4, 3), Vector2(5, 3), Vector2(6, 3), Vector2(7, 3), Vector2(8, 3),
		# Row 4
		#Vector2(0, 4), 
		Vector2(2, 4), Vector2(3, 4), Vector2(4, 4), Vector2(5, 4), Vector2(6, 4), 
		#Vector2(8, 4)
	]
	
	# Create MapNode instances
	var nodes: Array[MapNode] = []
	for i in range(raw_positions.size()):
		var pos = raw_positions[i]
		var scaled_x = pos.x * BoardConstants.SPACING
		var scaled_y = (((1.1 * BoardConstants.SPACING) + BoardConstants.SPACING * pos.y * 0.5 if pos.x == 1 or pos.x == 7 else BoardConstants.SPACING * pos.y * 1))
		var scaled_pos = Vector2(scaled_x, scaled_y)
		nodes.append(MapNode.new(scaled_pos, i))
	
	# Connect nodes to the 8 surrounding nodes
	for i in range(nodes.size()):
		var current_node = nodes[i]
		var current_pos = current_node.position

		# Define the 8 possible directions (right, down, left, up, and the 4 diagonals)
		var directions = [
			Vector2(BoardConstants.SPACING, 0), Vector2(-BoardConstants.SPACING, 0),
			Vector2(0, BoardConstants.SPACING), Vector2(0, -BoardConstants.SPACING),
			Vector2(BoardConstants.SPACING, BoardConstants.SPACING), Vector2(BoardConstants.SPACING, -BoardConstants.SPACING),
			Vector2(-BoardConstants.SPACING, BoardConstants.SPACING), Vector2(-BoardConstants.SPACING, -BoardConstants.SPACING)
		]

		# Connect to nodes in all 8 directions
		for direction in directions:
			var neighbor_pos = current_pos + direction
			var neighbor_index = Utils.find_index(nodes, neighbor_pos)
			if neighbor_index != -1:
				current_node.connected.append(nodes[neighbor_index])

	# Get the papan_place node
	var papan_place = $papan_place
	
	# Create visual elements
	for node in nodes:
		papan_place.add_child(Utils.create_circle(node.position, node.id))
		
		# Create lines to connected nodes
		for connected in node.connected:
			# Only create line if it's not already created (avoid duplicates)
			var connected_pos = connected.position
			if connected_pos > node.position:
				papan_place.add_child(Utils.create_line(node.position, connected_pos))
