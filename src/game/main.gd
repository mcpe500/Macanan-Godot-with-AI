extends Node2D

# Load the main menu and papan scenes
var main_menu_scene = preload("res://scenes/MainMenu.tscn")
var papan_scene = preload("res://scenes/papan.tscn")

func _ready() -> void:
	# Show the main menu initially
	show_main_menu()

func show_main_menu() -> void:
	# Load and add the main menu scene as a child
	var main_menu_instance = main_menu_scene.instantiate()
	add_child(main_menu_instance)

func show_play_options() -> void:
	# Remove the main menu scene
	for child in get_children():
		child.queue_free()

	# Load and add the play options scene as a child
	var play_options_instance = preload("res://scenes/PlayMenuOptions.tscn").instantiate()
	add_child(play_options_instance)

	# Connect the game_started signal to the start_game function
	play_options_instance.connect("game_started", self, "start_game")

func start_game(_game_config) -> void:
	# Remove the play options scene
	for child in get_children():
		child.queue_free()

	# Load and add the papan scene as a child
	var papan_instance = papan_scene.instantiate()
	add_child(papan_instance)

	# Optionally, you can pass the game configuration to the papan scene
	papan_instance.game_config = _game_config
