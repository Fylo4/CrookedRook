export const enum Wins {
	royal_extinction = 1,
	bare_royal,
	stalemate,
	campmate,
	royal_capture_n,
	check_n,
}
export const wins_str = ["EMPTY", "royal_extinction", "bare_royal", "stalemate", "campmate", "royal_capture_", "check_"];
export const enum Draws {
	repetition_n = 0,
	repetition_force_n,
	moves_n,
	stalemate,
	moves_force_n,
	mutual_pass,
}
export const draws_str = ["repetition_", "repetition_force_", "moves_", "stalemate", "moves_force_", "mutual_pass"];
export const enum Events {
	enter,
	exit,
	between,
	drop,
	self
}
export const events_str = ["enter", "exit", "between", "drop", "self"];
export const enum PieceAttributes {
	ally_static= 0,
	enemy_static= 1,
	kill_ally= 2,
	save_enemy= 3,
	flip_this_on_attack= 4,
	dont_flip_enemy= 5,
	fireball= 6,
	bomb= 7,
	save_self= 8,
	transform_on_death= 9,
	ep_capturer= 10,
	ep_captured= 11,
	castle_from= 12,
	castle_to= 13,
	pusher= 14,
	burn_passive= 15,
	burn_peaceful= 16,
	burn_attack= 17,
	burn_death= 18,
	burn_allies= 19,
	burn_immune= 20,
	coward= 21,
	child= 22,
	berzerk= 23,
	spawn_trail= 24,
	spawn_constant= 25,
	spawn_on_death= 26,
	endangered= 27, //Extinct species = win
	attacker_moves= 28,
	defender_moves= 29,
	tall= 30,
	iron= 31,
	silver= 32,
	bronze= 33,
	royal= 34,
	ghost= 35,
	flip_on_passive= 36,
	forced_step= 37,
	retreat= 38,
	bloodlust= 39,
	promote_on_attack= 40,
	kill_between= 41,
	mud_curse= 42,
	ghost_curse= 43,
	restart_timer = 44,
	curse_immune = 45,
	infect_curse = 46,
    empower= 47,
    random_promotion= 48,
	dont_flip_on_death= 49,
	destroy_on_capture= 50,
	destroy_on_burn= 51,
	promote_from_opp_hand= 52,
	peaceful= 53,
	glue_curse= 54,
	peace_curse= 55,
	curse_allies= 56,
	iron_bless= 57,
	bless_enemies= 58,
	copy_move= 59,
	copy_attrib= 60,
	ninja= 61,
	statue= 62,
	no_default_move= 63,
}
export const attrib_str = ["ally_static", "enemy_static", "kill_ally", "save_enemy", "flip_this_on_attack", 
"dont_flip_enemy", "fireball", "bomb", "save_self", "transform_on_death", "ep_capturer", "ep_captured",
"castle_from", "castle_to", "pusher", "burn_passive", "burn_peaceful", "burn_attack", "burn_death",
"burn_allies", "burn_immune", "coward", "child", "berzerk", "spawn_trail", "spawn_constant", "spawn_on_death",
"endangered", "attacker_moves", "defender_moves", "tall", "iron", "silver", "bronze", "royal", "ghost",
"flip_on_passive", "forced_step", "retreat", "bloodlust", "promote_on_attack", "kill_between", "mud_curse", 
"ghost_curse", "restart_timer", "curse_immune", "infect_curse", "empower", "random_promotion","dont_flip_on_death",
"destroy_on_capture", "destroy_on_burn", "promote_from_opp_hand", "peaceful", "glue_curse", "peace_curse",
"curse_allies", "iron_bless", "bless_enemies", "copy_move", "copy_attrib", "ninja", "statue", "no_default_move"];

export const preset_move_types = [
	{ a: "[0]", b: "[0 0 1 1]"},
	{ a: "[W]", b: "[1 0 4 1]"},
	{ a: "[F]", b: "[1 1 4 1]"},
	{ a: "[D]", b: "[2 0 4 1]"},
	{ a: "[N]", b: "[2 1 8 1]"},
	{ a: "[A]", b: "[2 2 4 1]"},
	{ a: "[H]", b: "[3 0 4 1]"},
	{ a: "[C]", b: "[3 1 8 1]"},
	{ a: "[Z]", b: "[3 2 8 1]"},
	{ a: "[G]", b: "[3 3 4 1]"},
	{ a: "[K]", b: "[1 1 8 1]"},
	{ a: "[B]", b: "[1 1 4 -1]"},
	{ a: "[R]", b: "[1 0 4 -1]"},
	{ a: "[Q]", b: "[1 1 8 -1]"},
	{ a: "[Nr]", b: "[2 1 8 -1]"}, //Knightrider
	{ a: "[L]", b: "[0 1 1 -1]"}, //Lance
	{ a: "[S]", b: "[0 1 1 1]"}, //Step
	{ a: "[JN]", b: "([1 2 1 1],[-1 2 1 1])"}, //Japanese Knight
	{ a: "[P]", b: "([1 1 1 1],[-1 1 1 1])"}, //Pawn attack
	{ a: "[Gr]", b: "([1 1 1 -1],[-1 1 1 -1])"}, //Griffin
	{ a: "[So]", b: "([0 1 1 1],[1 0 2 1])"}, //Soldier
	{ a: "[Si]", b: "([1 1 4 1],[0 1 1 1])"}, //Silver
	{ a: "[Go]", b: "([0 1 4 1],[1 1 1 1],[-1 1 1 1])"}, //Gold
];

export const enum BoardStyles {
	checkered = "checkered",
	uncheckered = "uncheckered",
	ashtapada = "ashtapada",
	intersection = "intersection",
	xiangqi = "xiangqi"
}

export const enum SnapModes {
	clockwise = "clockwise",
	counterclockwise = "counterclockwise",
	diagonal = "diagonal",
	orthogonal = "orthogonal"
}

export const enum GameRules {
	flip_colors = 0,
	has_hand,
	force_drop,
	destroy_on_burn,
	destroy_on_capture,
	berzerk,
	can_pass,
}
export const game_rules_str = ["flip_colors", "has_hand", "force_drop", "destroy_on_burn", "destroy_on_capture", "berzerk", "can_pass"];