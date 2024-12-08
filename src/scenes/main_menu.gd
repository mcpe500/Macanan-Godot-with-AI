extends Node2D

func _ready() -> void:
	$PlayButton.pressed.connect(_on_play_pressed)
	
func _on_play_pressed():
	var play_menu_options_scene = load("res://src/scenes/PlayMenuOptions.tscn")  # Path to your PlayMenuOptions scene
	var play_menu_options_instance = play_menu_options_scene.instantiate()
	
	add_child(play_menu_options_instance)  # Add as child of MainMenu
	play_menu_options_instance.game_started.connect(Callable(self, "_on_game_started"))

func _on_game_started(_game_config):
	var papan_scene = preload("res://src/scenes/papan.tscn")
	var papan_instance = papan_scene.instantiate()
	# Pass the game configuration to the papan scene
	papan_instance.game_config = _game_config
	# Replace the current scene with the papan scene
	get_tree().change_scene_to(papan_instance)
