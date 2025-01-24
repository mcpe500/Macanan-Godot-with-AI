// gameConstants.js
export const CONNECTIONS = {
    0: new Uint8Array([1, 5, 6]),
    1: new Uint8Array([0, 2, 6]),
    2: new Uint8Array([1, 3, 6, 7, 8]),
    3: new Uint8Array([2, 4, 8]),
    4: new Uint8Array([3, 8, 9]),
    5: new Uint8Array([0, 6, 10]),
    6: new Uint8Array([0, 1, 2, 5, 7, 10, 11, 12]),
    7: new Uint8Array([2, 6, 8, 12]),
    8: new Uint8Array([2, 3, 4, 7, 9, 12, 13, 14]),
    9: new Uint8Array([4, 8, 14]),
    10: new Uint8Array([5, 6, 11, 15, 16, 26, 28, 30]),
    11: new Uint8Array([6, 10, 12, 16]),
    12: new Uint8Array([6, 7, 8, 11, 13, 16, 17, 18]),
    13: new Uint8Array([8, 12, 14, 18]),
    14: new Uint8Array([8, 9, 13, 18, 19, 31, 33, 35]),
    15: new Uint8Array([10, 16, 20]),
    16: new Uint8Array([10, 11, 12, 15, 17, 20, 21, 22]),
    17: new Uint8Array([12, 16, 18, 22]),
    18: new Uint8Array([12, 13, 14, 17, 19, 22, 23, 24]),
    19: new Uint8Array([14, 18, 24]),
    20: new Uint8Array([15, 16, 21]),
    21: new Uint8Array([16, 20, 22]),
    22: new Uint8Array([16, 17, 18, 21, 23]),
    23: new Uint8Array([18, 22, 24]),
    24: new Uint8Array([18, 19, 23]),
    25: new Uint8Array([26, 27]),
    26: new Uint8Array([25, 28, 10]),
    27: new Uint8Array([25, 28, 29]),
    28: new Uint8Array([26, 27, 10, 30]),
    29: new Uint8Array([27, 30]),
    30: new Uint8Array([28, 29, 10]),
    31: new Uint8Array([14, 32, 33]),
    32: new Uint8Array([31, 34]),
    33: new Uint8Array([14, 31, 34, 35]),
    34: new Uint8Array([32, 33, 36]),
    35: new Uint8Array([14, 33, 36]),
    36: new Uint8Array([34, 35])
}

export const MACAN_JUMP = {
    0: {
        2: new Uint8Array([1]),
        4: new Uint8Array([1, 2, 3]),
        12: new Uint8Array([6]),
        24: new Uint8Array([6, 12, 18]),
        10: new Uint8Array([5]),
        20: new Uint8Array([5, 10, 15])
    },
    1: {
        3: new Uint8Array([2]),
        11: new Uint8Array([6]),
        21: new Uint8Array([6, 11, 16])
    },
    2: {
        4: new Uint8Array([3]),
        14: new Uint8Array([8]),
        36: new Uint8Array([8, 14, 35]),
        12: new Uint8Array([7]),
        22: new Uint8Array([7, 12, 17]),
        10: new Uint8Array([6]),
        29: new Uint8Array([6, 10, 30]),
        0: new Uint8Array([1])
    },
    3: {
        13: new Uint8Array([8]),
        23: new Uint8Array([8, 13, 18]),
        1: new Uint8Array([2])
    },
    4: {
        14: new Uint8Array([9]),
        24: new Uint8Array([9, 14, 19]),
        12: new Uint8Array([8]),
        20: new Uint8Array([8, 12, 16]),
        2: new Uint8Array([3]),
        0: new Uint8Array([3, 2, 1])
    },
    5: {
        7: new Uint8Array([6]),
        9: new Uint8Array([6, 7, 8]),
        15: new Uint8Array([10])
    },
    6: {
        8: new Uint8Array([7]),
        18: new Uint8Array([12]),
        16: new Uint8Array([11]),
        30: new Uint8Array([10])
    },
    7: {
        9: new Uint8Array([8]),
        17: new Uint8Array([12]),
        5: new Uint8Array([6])
    },
    8: {
        35: new Uint8Array([14]),
        18: new Uint8Array([13]),
        16: new Uint8Array([12]),
        6: new Uint8Array([7])
    },
    9: {
        19: new Uint8Array([14]),
        7: new Uint8Array([8]),
        5: new Uint8Array([8, 7, 6])
    },
    10: {
        12: new Uint8Array([11]),
        14: new Uint8Array([11, 12, 13]),
        34: new Uint8Array([11, 12, 13, 14, 33]),
        22: new Uint8Array([16]),
        20: new Uint8Array([15]),
        29: new Uint8Array([30]),
        27: new Uint8Array([28]),
        25: new Uint8Array([26]),
        0: new Uint8Array([5]),
        2: new Uint8Array([6])
    },
    11: {
        13: new Uint8Array([12]),
        33: new Uint8Array([12, 13, 14]),
        21: new Uint8Array([16]),
        28: new Uint8Array([10]),
        1: new Uint8Array([6])
    },
    12: {
        14: new Uint8Array([13]),
        34: new Uint8Array([13, 14, 33]),
        24: new Uint8Array([18]),
        22: new Uint8Array([17]),
        20: new Uint8Array([16]),
        10: new Uint8Array([11]),
        27: new Uint8Array([11, 10, 28]),
        0: new Uint8Array([6]),
        2: new Uint8Array([7]),
        4: new Uint8Array([8])
    },
    13: {
        33: new Uint8Array([14]),
        23: new Uint8Array([18]),
        11: new Uint8Array([12]),
        28: new Uint8Array([12, 11, 10]),
        3: new Uint8Array([8])
    },
    14: {
        34: new Uint8Array([33]),
        36: new Uint8Array([35]),
        24: new Uint8Array([19]),
        22: new Uint8Array([18]),
        12: new Uint8Array([13]),
        10: new Uint8Array([13, 12, 11]),
        27: new Uint8Array([13, 12, 11, 10, 28]),
        2: new Uint8Array([8]),
        4: new Uint8Array([9]),
        32: new Uint8Array([31])
    },
    15: {
        17: new Uint8Array([16]),
        19: new Uint8Array([16, 17, 18]),
        5: new Uint8Array([10])
    },
    16: {
        18: new Uint8Array([17]),
        26: new Uint8Array([10]),
        6: new Uint8Array([11]),
        8: new Uint8Array([12])
    },
    17: {
        19: new Uint8Array([18]),
        15: new Uint8Array([16]),
        7: new Uint8Array([12])
    },
    18: {
        16: new Uint8Array([17]),
        6: new Uint8Array([12]),
        8: new Uint8Array([13]),
        31: new Uint8Array([14])
    },
    19: {
        17: new Uint8Array([18]),
        15: new Uint8Array([18, 17, 16]),
        9: new Uint8Array([14])
    },
    20: {
        22: new Uint8Array([21]),
        24: new Uint8Array([21, 22, 23]),
        10: new Uint8Array([15]),
        0: new Uint8Array([15, 10, 5]),
        12: new Uint8Array([16]),
        4: new Uint8Array([16, 12, 8])
    },
    21: {
        23: new Uint8Array([22]),
        11: new Uint8Array([16]),
        1: new Uint8Array([16, 11, 6])
    },
    22: {
        24: new Uint8Array([23]),
        20: new Uint8Array([21]),
        10: new Uint8Array([16]),
        25: new Uint8Array([16, 10, 26]),
        12: new Uint8Array([17]),
        2: new Uint8Array([17, 12, 7]),
        14: new Uint8Array([18]),
        32: new Uint8Array([18, 14, 31])
    },
    23: {
        21: new Uint8Array([22]),
        13: new Uint8Array([18]),
        3: new Uint8Array([18, 13, 8])
    },
    24: {
        22: new Uint8Array([23]),
        20: new Uint8Array([23, 22, 21]),
        12: new Uint8Array([18]),
        0: new Uint8Array([18, 12, 6]),
        14: new Uint8Array([19]),
        4: new Uint8Array([19, 14, 9])
    },
    25: {
        10: new Uint8Array([26]),
        22: new Uint8Array([26, 10, 16]),
        29: new Uint8Array([27])
    },
    26: {
        16: new Uint8Array([10]),
        30: new Uint8Array([28])
    },
    27: {
        10: new Uint8Array([28]),
        12: new Uint8Array([28, 10, 11]),
        14: new Uint8Array([28, 10, 11, 12, 13]),
        34: new Uint8Array([28, 10, 11, 12, 13, 14, 33])
    },
    28: {
        11: new Uint8Array([10]),
        13: new Uint8Array([10, 11, 12]),
        33: new Uint8Array([10, 11, 12, 13, 14])
    },
    29: {
        25: new Uint8Array([27]),
        10: new Uint8Array([30]),
        2: new Uint8Array([30, 10, 6])
    },
    30: {
        26: new Uint8Array([28]),
        6: new Uint8Array([10])
    },
    31: {
        35: new Uint8Array([33]),
        18: new Uint8Array([14])
    },
    32: {
        36: new Uint8Array([34]),
        14: new Uint8Array([31]),
        22: new Uint8Array([31, 14, 18])
    },
    33: {
        13: new Uint8Array([14]),
        11: new Uint8Array([14, 13, 12]),
        28: new Uint8Array([14, 13, 12, 11, 10])
    },
    34: {
        14: new Uint8Array([33]),
        12: new Uint8Array([33, 14, 13]),
        10: new Uint8Array([33, 14, 13, 12, 11]),
        27: new Uint8Array([33, 14, 13, 12, 11, 10, 28])
    },
    35: {
        8: new Uint8Array([14]),
        31: new Uint8Array([33])
    },
    36: {
        14: new Uint8Array([35]),
        2: new Uint8Array([35, 14, 8]),
        32: new Uint8Array([34])
    }
};

export const INITIAL_FORMATION_POSITIONS = [6, 7, 8, 11, 12, 13, 16, 17, 18];
export const BOARD_SIZE = 37;
export const INITIAL_UWONG_PAWNS = 21;
export const WINNING_UWONG_COUNT = 14;