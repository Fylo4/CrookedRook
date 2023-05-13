const ends = {
	royal_capture: 0,
	royal_extinction: 1,
	bare_royal: 2,
	stalemate: 3
}
const ends_str = ["royal_capture", "royal_extinction", "bare_royal", "stalemate"];
const events = {
	enter: 0,
	exit: 1,
	between: 2,
	drop: 3,
	self: 4
}
const events_str = ["enter", "exit", "between", "drop", "self"];
const attrib = {
	ally_static: 0,
	enemy_static: 1,
	kill_ally: 2,
	save_enemy: 3,
	flip_this_on_attack: 4,
	dont_flip_enemy: 5,
	fireball: 6,
	bomb: 7,
	save_self: 8,
	transform_on_death: 9,
	ep_capturer: 10,
	ep_captured: 11,
	castle_from: 12,
	castle_to: 13,
	pusher: 14,
	burn_passive: 15,
	burn_peaceful: 16,
	burn_attack: 17,
	burn_death: 18,
	burn_allies: 19,
	burn_immune: 20,
	coward: 21,
	child: 22,
	berzerk: 23,
	spawn_trail: 24,
	spawn_constant: 25,
	spawn_on_death: 26,
	EMPTY: 27,
	attacker_moves: 28,
	defender_moves: 29,
	tall: 30,
	iron: 31,
	silver: 32,
	bronze: 33,
	royal: 34,
	ghost: 35,
	flip_on_passive: 36,
	forced_step: 37,
	retreat: 38,
	bloodlust: 39,
	promote_on_attack: 40,
	kill_between: 41,
	mud_curse: 42,
	ghost_curse: 43,
	defender: 44,
	pacifier: 45,
	anchor: 46,
    empower: 47,
    random_promotion: 48,
	dont_flip_on_death: 49,
	destroy_on_capture: 50,
	destroy_on_burn: 51,
	promote_from_opp_hand: 52,
	peaceful: 53,
	glue_curse: 54,
	peace_curse: 55,
	curse_allies: 56,
	iron_bless: 57,
	bless_enemies: 58,
	copy_move: 59,
	copy_attrib: 60,
	ninja: 61,
	statue: 62,
	no_default_move: 63,
}
const attrib_str = ["ally_static", "enemy_static", "kill_ally", "save_enemy", "flip_this_on_attack", 
"dont_flip_enemy", "fireball", "bomb", "save_self", "transform_on_death", "ep_capturer", "ep_captured",
"castle_from", "castle_to", "pusher", "burn_passive", "burn_peaceful", "burn_attack", "burn_death",
"burn_allies", "burn_immune", "coward", "child", "berzerk", "spawn_trail", "spawn_constant", "spawn_on_death",
"EMPTY", "attacker_moves", "defender_moves", "tall", "iron", "silver", "bronze", "royal", "ghost",
"flip_on_passive", "forced_step", "retreat", "bloodlust", "promote_on_attack", "kill_between",
"mud_curse", "ghost_curse", "defender", "pacifier", "anchor", "empower", "random_promotion", "dont_flip_on_death",
"destroy_on_capture", "destroy_on_burn", "promote_from_opp_hand", "peaceful", "glue_curse", "peace_curse",
"curse_allies", "iron_bless", "bless_enemies", "copy_move", "copy_attrib", "ninja", "statue", "no_default_move"];

const preset_move_types = [
	{ a: "[0]", b: "[0 0 1 1]"},
	{ a: "[W]", b: "[1 0 4 1]"},
	{ a: "[F]", b: "[1 1 4 1]"},
	{ a: "[D]", b: "[2 0 4 1]"},
	{ a: "[N]", b: "[2 1 8 1]"},
	{ a: "[Nr]", b: "[2 1 8 -1]"}, //Knightrider
	{ a: "[A]", b: "[2 2 4 1]"},
	{ a: "[H]", b: "[3 0 4 1]"},
	{ a: "[C]", b: "[3 1 8 1]"},
	{ a: "[Z]", b: "[3 2 8 1]"},
	{ a: "[G]", b: "[3 3 4 1]"},
	{ a: "[K]", b: "[1 1 8 1]"},
	{ a: "[B]", b: "[1 1 4 -1]"},
	{ a: "[R]", b: "[1 0 4 -1]"},
	{ a: "[Q]", b: "[1 1 8 -1]"},
	{ a: "[L]", b: "[0 1 1 -1]"}, //Lance
	{ a: "[JN]", b: "([1 2 1 1],[-1 2 1 1])"}, //Japanese Knight
	{ a: "[P]", b: "([1 1 1 1],[-1 1 1 1])"}, //Pawn attack
	{ a: "[S]", b: "[0 1 1 1]"}, //Step
	{ a: "[Gr]", b: "([1 1 1 -1],[-1 1 1 -1])"}, //Griffin
	{ a: "[So]", b: "([0 1 1 1],[1 0 2 1])"}, //Soldier
	{ a: "[Si]", b: "([1 1 4 1],[0 1 1 1])"}, //Silver
	{ a: "[Go]", b: "([0 1 4 1],[1 1 1 1],[-1 1 1 1])"}, //Gold
];

const folders = {
	chess: 0,
	shogi: 1,
	xiangqi: 2,
	historical: 3,
	regional: 4,
	ccit: 5,
	compound: 6,
	SEA: 7,
	other: 8
}

let preset_variants = [];
for(let a = 0; a < Object.keys(folders).length; a ++) {
	preset_variants.push([]);
}