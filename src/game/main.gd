# main.gd
extends Node2D

func _ready() -> void:
	show_main_menu()

func show_main_menu() -> void:
	var main_menu_scene = load("res://src/scenes/MainMenu.tscn")
	if main_menu_scene:
		var main_menu = main_menu_scene.instantiate()
		add_child(main_menu)
		# Center the menu
		main_menu.position = Vector2(get_viewport_rect().size / 2)
	else:
		push_error("Failed to load MainMenu.tscn")

func show_play_options() -> void:
	for child in get_children():
		if child is Camera2D:
			continue
		child.queue_free()
	var play_options = load("res://src/scenes/PlayMenuOptions.tscn").instantiate()
	add_child(play_options)
	play_options.position = Vector2(get_viewport_rect().size / 2)

func start_game(game_config: Dictionary) -> void:
	for child in get_children():
		if child is Camera2D:
			continue
		child.queue_free()
	var game_scene = load("res://src/scenes/papan.tscn").instantiate()
	add_child(game_scene)
