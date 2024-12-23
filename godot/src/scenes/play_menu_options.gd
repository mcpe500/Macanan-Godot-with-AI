extends Node2D

# Define the game_started signal
signal game_started(_game_config)

# Game configuration
var game_config = {
	"mode": "pvp",
	"game_type": "21v1",
	"ai_difficulty": "normal",
	"player_side": "uwong"
}

func _ready() -> void:
	setup_buttons()

func setup_buttons() -> void:
	# Connect buttons to their respective functions
	$PvPButton.pressed.connect(func(): set_mode("pvp"))
	$PvAIButton.pressed.connect(func(): set_mode("pva"))
	$AIPButton.pressed.connect(func(): set_mode("aip"))
	$AIAIButton.pressed.connect(func(): set_mode("aiai"))
	$"21v1Button".pressed.connect(func(): set_game_type("21v1"))
	$"8v2Button".pressed.connect(func(): set_game_type("8v2"))
	$AIOptions/EasyButton.pressed.connect(func(): set_ai_difficulty("easy"))
	$AIOptions/NormalButton.pressed.connect(func(): set_ai_difficulty("normal"))
	$AIOptions/HardButton.pressed.connect(func(): set_ai_difficulty("hard"))
	$AIOptions/InsaneButton.pressed.connect(func(): set_ai_difficulty("insane"))
	$SideOptions/UwongButton.pressed.connect(func(): set_player_side("uwong"))
	$SideOptions/MacanButton.pressed.connect(func(): set_player_side("macan"))
	$StartButton.pressed.connect(func(): start_game(game_config)) # Pass game_config
	$BackButton.pressed.connect(back_to_main_menu) # Already no argument

	# Set initial visibility
	$AIOptions.visible = false
	$SideOptions.visible = false

	update_ui()

func set_mode(mode: String) -> void:
	game_config.mode = mode
	update_ui()

func set_game_type(game_type: String) -> void:
	game_config.game_type = game_type
	update_ui()

func set_ai_difficulty(difficulty: String) -> void:
	game_config.ai_difficulty = difficulty
	update_ui()

func set_player_side(side: String) -> void:
	game_config.player_side = side
	update_ui()

func update_ui() -> void:
	# Update visibility based on the selected mode
	$AIOptions.visible = game_config.mode in ["pva", "aip", "aiai"]
	$SideOptions.visible = game_config.mode in ["pva", "aip"]

	# Update button states
	$PvPButton.disabled = game_config.mode == "pvp"
	$PvAIButton.disabled = game_config.mode == "pva"
	$AIPButton.disabled = game_config.mode == "aip"
	$AIAIButton.disabled = game_config.mode == "aiai"
	$"21v1Button".disabled = game_config.game_type == "21v1"
	$"8v2Button".disabled = game_config.game_type == "8v2"
	$AIOptions/EasyButton.disabled = game_config.ai_difficulty == "easy"
	$AIOptions/NormalButton.disabled = game_config.ai_difficulty == "normal"
	$AIOptions/HardButton.disabled = game_config.ai_difficulty == "hard"
	$AIOptions/InsaneButton.disabled = game_config.ai_difficulty == "insane"
	$SideOptions/UwongButton.disabled = game_config.player_side == "uwong"
	$SideOptions/MacanButton.disabled = game_config.player_side == "macan"

func start_game(_game_config) -> void:
	# Emit a signal to start the game with the current configuration
	emit_signal("game_started", _game_config)

func back_to_main_menu() -> void:
	# Emit a signal to return to the main menu
	emit_signal("back_to_main_menu")
