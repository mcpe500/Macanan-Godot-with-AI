extends Node3D

func create_ball(pos: Vector3, color: Color = Color(1, 0, 0)) -> MeshInstance3D:
	# Create a new spherical mesh
	var sphere_mesh = SphereMesh.new()
	
	# Make the sphere more visible
	sphere_mesh.radius = 0.25
	sphere_mesh.height = 0.5
	
	# Create a MeshInstance3D to render the sphere
	var mesh_instance = MeshInstance3D.new()
	mesh_instance.mesh = sphere_mesh
	
	# Add material
	var material = StandardMaterial3D.new()
	material.albedo_color = color
	mesh_instance.material_override = material
	
	# Set position
	mesh_instance.position = pos
	
	return mesh_instance

func create_line(start_pos: Vector3, end_pos: Vector3) -> MeshInstance3D:
	# Create a cylinder to represent the line
	var cylinder = CylinderMesh.new()
	
	# Calculate length and position
	var length = start_pos.distance_to(end_pos)
	cylinder.height = length
	cylinder.top_radius = 0.1
	cylinder.bottom_radius = 0.1
	
	# Create mesh instance
	var mesh_instance = MeshInstance3D.new()
	mesh_instance.mesh = cylinder
	
	# Position and rotate the cylinder
	var mid_point = (start_pos + end_pos) / 2
	mesh_instance.position = mid_point
	
	# Make the cylinder look at the end position
	mesh_instance.look_at_from_position(mid_point, end_pos, Vector3.UP)
	mesh_instance.rotate_object_local(Vector3.RIGHT, PI / 2)
	
	return mesh_instance

func _ready() -> void:
	# Get the papan_place node - Change this line
	var papan_place = get_node("papan_place")
	
	# Create 2x2 grid of balls
	var spacing = 1.5
	var positions = []

	for i in range(5):
		for j in range(5):
			positions.append(Vector3(i * spacing - 2 * spacing, 0.5, j * spacing - 2 * spacing))
	
	
	# Create balls
	var balls = []
	for pos in positions:
		var ball = create_ball(pos)
		papan_place.add_child(ball)
		balls.append(ball)
	
	# Create connections (lines between balls)
	# Horizontal connections
	
	for i in range(5):
		for j in range(5):
			if i != j:
				papan_place.add_child(create_line(positions[j], positions[i]))
	
	
	# papan_place.add_child(create_line(positions[0], positions[1]))
	# papan_place.add_child(create_line(positions[2], positions[3]))
	
	# # Vertical connections
	# papan_place.add_child(create_line(positions[0], positions[2]))
	# papan_place.add_child(create_line(positions[1], positions[3]))
