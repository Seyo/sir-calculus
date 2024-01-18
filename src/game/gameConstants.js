export const PLAYER_START_X = 150
export const MOVE_FRAME_COUNT = 4
export const JUMP_FRAME_COUNT = 3
export const SCALE = 3
export const ATTACK_DISTANCE = 12 * SCALE

export const DISTANCE_IN_MOVE_ANIMATION = 12 * SCALE

export const PLAYER_OUTSIDE_START = -4
export const MOVE_IN_ANIM_REPEATS = Math.ceil((PLAYER_START_X - PLAYER_OUTSIDE_START) / DISTANCE_IN_MOVE_ANIMATION)

export const ENEMIES_LIST = ['mech1', 'mech2']