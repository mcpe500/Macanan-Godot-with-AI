# scenes/main_menu.gd
extends Node2D

func _ready() -> void:
	$PlayButton.pressed.connect(_on_play_pressed)

func _on_play_pressed() -> void:
	get_node("/root/Node2D").show_play_options()
