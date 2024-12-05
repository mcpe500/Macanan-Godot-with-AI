extends Node

const BoardConstants = preload("res://board_constants.gd")

static func get_middle_positions() -> Array:
    var positions = []
    for i in range(BoardConstants.MIDDLE_ROWS):
        for j in range(BoardConstants.MIDDLE_COLS):
            positions.append(Vector2(
                (j + BoardConstants.MIDDLE_OFFSET_X) * BoardConstants.SPACING,
                (i + BoardConstants.MIDDLE_OFFSET_Y) * BoardConstants.SPACING
            ))
    return positions

static func get_left_triangle_positions() -> Array:
    return [
        Vector2(BoardConstants.SPACING, BoardConstants.SPACING * 2),
        Vector2(0, BoardConstants.SPACING * 3),
        Vector2(BoardConstants.SPACING, BoardConstants.SPACING * 3),
        Vector2(BoardConstants.SPACING * 2, BoardConstants.SPACING * 3),
        Vector2(0, BoardConstants.SPACING * 4),
        Vector2(BoardConstants.SPACING, BoardConstants.SPACING * 4),
        Vector2(BoardConstants.SPACING * 2, BoardConstants.SPACING * 4)
    ]

static func get_right_triangle_positions() -> Array:
    return [
        Vector2(BoardConstants.SPACING * 7, BoardConstants.SPACING * 2),
        Vector2(BoardConstants.SPACING * 6, BoardConstants.SPACING * 3),
        Vector2(BoardConstants.SPACING * 7, BoardConstants.SPACING * 3),
        Vector2(BoardConstants.SPACING * 8, BoardConstants.SPACING * 3),
        Vector2(BoardConstants.SPACING * 6, BoardConstants.SPACING * 4),
        Vector2(BoardConstants.SPACING * 7, BoardConstants.SPACING * 4),
        Vector2(BoardConstants.SPACING * 8, BoardConstants.SPACING * 4)
    ]