extends Node

class_name MapNode

var position: Vector2
var connected: Array[MapNode]
var id: int	

func _init(pos: Vector2, node_id: int) -> void:
	position = pos
	connected = []
	id = node_id
