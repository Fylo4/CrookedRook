import { GameData } from "./game_data/GameData";
import { Squareset } from "./Squareset";
import { gcd } from "./utils";

//Used in start_game
export function get_slide_ss(start_x: number, start_y: number, delta_x: number, delta_y: number, angle: number,
    sym: number, len_max: number, game_data: GameData){
	let ret = new Squareset(game_data.width*game_data.height);
	if(len_max <= 0 || len_max > 256){
		len_max = 256;
	}
	for(var a = 0; a < 8; a += 8/sym){
		var d = get_rot(delta_x, -delta_y, a+angle);
		//d=delta; the vector that we're sliding each step
		for(let cx = start_x+d.x, cy = start_y+d.y, i=0; i < len_max; cx += d.x, cy += d.y, i ++){
			if(!game_data.on_board(cx, cy)){ break; }
			ret.set_on(cy*game_data.width+cx);
		}
	}
	return ret;
}

//Used in start_game
export function bnb_ep_squaresets(width: number, height: number, active_ss: Squareset){
	let bnb: Squareset[][] = [];
	let ep: Squareset[][]  = [];
	for(var a = 0; a < width*height; a ++){
		bnb.push([]);
		ep.push([]);
		for(var b = 0; b < width*height; b ++){
			bnb[a].push(new Squareset(width*height));
			 ep[a].push(new Squareset(width*height));
			var a_x = a%width, a_y = Math.floor(a/width);
			var b_x = b%width, b_y = Math.floor(b/width);
			var d_x = b_x-a_x, d_y=b_y-a_y;
			if(d_x === d_y && d_y === 0){ continue; }
			var d_gcd = Math.abs(gcd(d_x, d_y));
			d_x /= d_gcd;
			d_y /= d_gcd;
            for (var cx = b_x + d_x, cy = b_y + d_y;
                cx >= 0 && cx < width && cy >= 0 && cy < height && active_ss.get(cy * width + cx);
                cx += d_x, cy += d_y){
				bnb[a][b].set_on(cy*width+cx);
			}
            for (var cx = a_x + d_x, cy = a_y + d_y;
                (cx != b_x || cy != b_y) && cx >= 0 && cx < width && cy >= 0 && cy < height && active_ss.get(cy * width + cx);
                cx+= d_x, cy += d_y){
				ep[a][b].set_on(cy*width+cx);
			}
		}
	}
	return {bnb_ss: bnb, ep_ss: ep};
}

//Used in start_game
export function get_bnb_ss(origin: number, destination: number, game_data: GameData) {
    // if (game_data.precompute) {
    //     return game_data.bnb_ss[orig][dest];
    // }
    
    let ret = new Squareset(game_data.width * game_data.height);
    let orig_x = origin%game_data.width, orig_y = Math.floor(origin/game_data.width);
    let dest_x = destination%game_data.width, dest_y = Math.floor(destination/game_data.width);
    let d_x = dest_x - orig_x, d_y = dest_y - orig_y;
    if (d_x === 0 && d_y === 0){
        return ret;
    }
    let d_gcd = Math.abs(gcd(d_x, d_y));
    d_x /= d_gcd;
    d_y /= d_gcd;
    for (var cx = dest_x + d_x, cy = dest_y + d_y;
        cx >= 0 && cx < game_data.width && cy >= 0 && cy < game_data.height && game_data.active_squares.get(cy * game_data.width + cx);
        cx += d_x, cy += d_y){
        ret.set_on(cy*game_data.width+cx);
    }
    return ret;
}

//Used in make_move
export function get_ep_ss(orig: number, dest: number, game_data: GameData) {
    // if (game_data.precomputed) {
    //     return game_data.ep_ss[orig][dest];
    // }

    let ret = new Squareset(game_data.width * game_data.height);
    let orig_x = orig%game_data.width, orig_y = Math.floor(orig/game_data.width);
    let dest_x = dest%game_data.width, dest_y = Math.floor(dest/game_data.width);
    let d_x = dest_x - orig_x, d_y = dest_y - orig_y;
    if (d_x === 0 && d_y === 0){
        return ret;
    }
    let d_gcd = Math.abs(gcd(d_x, d_y));
    d_x /= d_gcd;
    d_y /= d_gcd;
    for (var cx = orig_x + d_x, cy = orig_y + d_y;
        (cx != dest_x || cy != dest_y) && cx >= 0 && cx < game_data.width && cy >= 0 && cy < game_data.height && game_data.active_squares.get(cy * game_data.width + cx);
        cx+= d_x, cy += d_y){
        ret.set_on(cy*game_data.width+cx);
    }
    return ret;
}

//Only used internally
function get_rot(rx: number, ry: number, loops: number) {
    //I messed up and put it in the wrong direction
    loops = (8 - loops) % 8; //Band-aid solution
    while (loops < 0) {
        loops += 8;
    }
    if (rx === 0 && ry === 0) {
        return { x: 0, y: 0 };
    }
    for (var a = 0; a < loops; a++) {
        let tx: number, ty: number;
        if (rx === 0) { tx = -ry; ty = ry; }
        else if (ry === 0) { tx = rx; ty = rx; }
        else if (rx === ry) { tx = 0; ty = ry; }
        else if (rx === -ry) { tx = rx; ty = 0; }
        else if (rx > 0 && ry > 0) {
            if (rx > ry) {
                tx = ry;
                ty = rx;
            }
            else {
                tx = -rx;
                ty = ry;
            }
        }
        else if (rx > 0 && ry < 0) {
            if (rx > -ry) {
                tx = rx;
                ty = -ry;
            }
            else {
                tx = -ry;
                ty = -rx;
            }
        }
        else if (rx < 0 && ry > 0) {
            if (rx < -ry) {
                tx = rx;
                ty = -ry;
            }
            else {
                tx = -ry;
                ty = -rx;
            }
        }
        else {
            if (rx < ry) {
                tx = ry;
                ty = rx;
            }
            else {
                tx = -rx;
                ty = ry;
            }
        }
        rx = tx;
        ry = ty;
    }
    return { x: rx, y: ry };
}
