extends Camera2D

@export var zoom_speed: float = 0.1
@export var min_zoom: float = 0.5
@export var max_zoom: float = 2.0

func _process(delta: float) -> void:
	handle_input(delta)

func handle_input(delta: float) -> void:
	# Zoom in/out
	if Input.is_action_pressed("ui_zoom_in"):
		zoom = zoom + Vector2(zoom_speed, zoom_speed)
	elif Input.is_action_pressed("ui_zoom_out"):
		zoom = zoom - Vector2(zoom_speed, zoom_speed)
	
	zoom = zoom.clamp(Vector2(min_zoom, min_zoom), Vector2(max_zoom, max_zoom))
