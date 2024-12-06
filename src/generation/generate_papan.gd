extends Node2D

const BoardConstants = preload("res://src/constants/board_constants.gd")
const BoardPositions = preload("res://src/constants/board_positions.gd")
const MapNode = preload("res://src/models/MapNode.gd")
const Utils = preload("res://src/utils/utils.gd")

func _ready() -> void:
	var raw_positions = [
		# Row 0
		Vector2(0, 0), Vector2(2, 0), Vector2(3, 0), Vector2(4, 0), Vector2(5, 0), Vector2(6, 0), Vector2(8, 0),
		# Row 1
		Vector2(0, 1), Vector2(1, 1), Vector2(2, 1), Vector2(3, 1), Vector2(4, 1), Vector2(5, 1), Vector2(6, 1), Vector2(7, 1), Vector2(8, 1),
		# Row 2
		Vector2(0, 2), Vector2(1, 2), Vector2(2, 2), Vector2(3, 2), Vector2(4, 2), Vector2(5, 2), Vector2(6, 2), Vector2(7, 2), Vector2(8, 2),
		# Row 3
		Vector2(0, 3), Vector2(1, 3), Vector2(2, 3), Vector2(3, 3), Vector2(4, 3), Vector2(5, 3), Vector2(6, 3), Vector2(7, 3), Vector2(8, 3),
		# Row 4
		Vector2(0, 4), Vector2(2, 4), Vector2(3, 4), Vector2(4, 4), Vector2(5, 4), Vector2(6, 4), Vector2(8, 4)
	]
	
	# Create MapNode instances
	var nodes: Array[MapNode] = []
	for i in range(raw_positions.size()):
		var scaled_pos = raw_positions[i] * BoardConstants.SPACING
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
				# Exclude specific connections
				if not (
					(current_node.id == 2 and nodes[neighbor_index].id == 8) or
					(current_node.id == 8 and nodes[neighbor_index].id == 2) or
					(current_node.id == 9 and nodes[neighbor_index].id == 8) or
					(current_node.id == 8 and nodes[neighbor_index].id == 9) or
					(current_node.id == 9 and nodes[neighbor_index].id == 7) or
					(current_node.id == 7 and nodes[neighbor_index].id == 9) or
					(current_node.id == 7 and nodes[neighbor_index].id == 27) or
					(current_node.id == 27 and nodes[neighbor_index].id == 7) or
					(current_node.id == 26 and nodes[neighbor_index].id == 27) or
					(current_node.id == 27 and nodes[neighbor_index].id == 26) or
					(current_node.id == 26 and nodes[neighbor_index].id == 35) or
					(current_node.id == 35 and nodes[neighbor_index].id == 26) or
					(current_node.id == 1 and nodes[neighbor_index].id == 8) or
					(current_node.id == 8 and nodes[neighbor_index].id == 1) or
					(current_node.id == 9 and nodes[neighbor_index].id == 17) or
					(current_node.id == 17 and nodes[neighbor_index].id == 9) or
					(current_node.id == 17 and nodes[neighbor_index].id == 27) or
					(current_node.id == 27 and nodes[neighbor_index].id == 17) or
					(current_node.id == 5 and nodes[neighbor_index].id == 14) or
					(current_node.id == 14 and nodes[neighbor_index].id == 5) or
					(current_node.id == 13 and nodes[neighbor_index].id == 14) or
					(current_node.id == 14 and nodes[neighbor_index].id == 13) or
					(current_node.id == 23 and nodes[neighbor_index].id == 13) or
					(current_node.id == 13 and nodes[neighbor_index].id == 23) or
					(current_node.id == 23 and nodes[neighbor_index].id == 31) or
					(current_node.id == 31 and nodes[neighbor_index].id == 23) or
					(current_node.id == 32 and nodes[neighbor_index].id == 31) or
					(current_node.id == 31 and nodes[neighbor_index].id == 32) or
					(current_node.id == 39 and nodes[neighbor_index].id == 32) or
					(current_node.id == 32 and nodes[neighbor_index].id == 39)
				):
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
