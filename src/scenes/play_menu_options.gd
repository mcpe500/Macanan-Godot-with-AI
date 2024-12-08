# scenes/play_menu_options.gd
extends Node2D

var current_config = {
	"mode": "pvp", # or "ai"
	"game_type": "21v1", # or "8v2"
	"ai_difficulty": "normal",
	"player_side": "uwong"
}

func _ready() -> void:
	setup_buttons()
	
func setup_buttons() -> void:
	# Mode selection
	$PvPButton.pressed.connect(func(): set_mode("pvp"))
	$PvAIButton.pressed.connect(func(): set_mode("ai"))
	
	# Game type selection
	$"21v1Button".pressed.connect(func(): set_game_type("21v1"))
	$"8v2Button".pressed.connect(func(): set_game_type("8v2"))
	
	# AI options
	$AIOptions/EasyButton.pressed.connect(func(): set_difficulty("easy"))
	$AIOptions/NormalButton.pressed.connect(func(): set_difficulty("normal"))
	$AIOptions/HardButton.pressed.connect(func(): set_difficulty("hard"))
	$AIOptions/InsaneButton.pressed.connect(func(): set_difficulty("insane"))
	
	# Side selection
	$SideOptions/UwongButton.pressed.connect(func(): set_side("uwong"))
	$SideOptions/MacanButton.pressed.connect(func(): set_side("macan"))
	
	$StartButton.pressed.connect(_on_start_pressed)
	$BackButton.pressed.connect(_on_back_pressed)
	
	update_ui()
	
func set_mode(mode: String) -> void:
	current_config.mode = mode
	update_ui()
	
func set_game_type(type: String) -> void:
	current_config.game_type = type
	update_ui()
	
func set_difficulty(difficulty: String) -> void:
	current_config.ai_difficulty = difficulty
	update_ui()
	
func set_side(side: String) -> void:
	current_config.player_side = side
	update_ui()
	
func update_ui() -> void:
	# Show/hide AI options based on mode
	print("Current mode: ", current_config.mode)
	$AIOptions.visible = current_config.mode == "ai"
	$SideOptions.visible = current_config.mode == "ai"
	
	# Reset button colors
	$PvPButton.modulate = Color.WHITE
	$PvAIButton.modulate = Color.WHITE
	
	# Highlight the selected mode button
	if current_config.mode == "pvp":
		$PvPButton.modulate = Color.GREEN
	elif current_config.mode == "ai":
		$PvAIButton.modulate = Color.GREEN
	
func _on_start_pressed() -> void:
	get_node("/root/Node2D").start_game(current_config)
	
func _on_back_pressed() -> void:
	get_node("/root/Node2D").show_main_menu()
