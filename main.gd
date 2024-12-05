extends Node2D

func _ready() -> void:
    var papan_scene = load("res://papan.tscn")
    var papan_instance = papan_scene.instantiate()
    add_child(papan_instance)