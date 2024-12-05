extends Camera3D

@export var zoom_speed: float = 1.0
@export var rotate_speed: float = 0.01
@export var min_distance: float = 2.0
@export var max_distance: float = 10.0

var distance: float = 5.0
var target: Vector3 = Vector3.ZERO

func _ready() -> void:
	distance = transform.origin.distance_to(target)
	update_camera_position()

func _process(delta: float) -> void:
	handle_input(delta)

func handle_input(delta: float) -> void:
	# Zoom in/out
	if Input.is_action_pressed("ui_zoom_in"):
		distance -= zoom_speed * delta
	elif Input.is_action_pressed("ui_zoom_out"):
		distance += zoom_speed * delta

	distance = clamp(distance, min_distance, max_distance)
	
	# Rotate around the target
	if Input.is_action_pressed("ui_rotate_left"):
		rotate_y(rotate_speed * delta)
	elif Input.is_action_pressed("ui_rotate_right"):
		rotate_y(-rotate_speed * delta)
	
	update_camera_position()

func update_camera_position() -> void:
	var direction = -transform.basis.z.normalized()
	transform.origin = target + direction * distance
	look_at(target, Vector3.UP)
