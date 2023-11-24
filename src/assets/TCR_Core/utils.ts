import { attrib_str, wins_str, draws_str, events_str } from "./Constants";
import { Squareset, squareset_from_string } from "./Squareset";
var Hjson = require('hjson');

export function gcd(a: number, b: number){
	if(b){
		return gcd(b, a%b);
	}
	else{
		return Math.abs(a);
	}
	//return b?gcd(b,a%b):Math.abs(a);
}

export function file (num: number) {
    if (num < 26) {
        return String.fromCharCode(97 + num);
    }
    else if (num < 26*2) {
        return String.fromCharCode(39 + num);
    }
    return "?"
};
export function rank (num: number, height: number) { return height - num; }

export function remove_nested_parenthases(string: string, open_char: string="(", close_char: string=")") {
    let parenth_layers = 0;
    let ret = "";
    for (let a = 0; a < string.length; a ++) {
        if (string[a] === open_char) {
            parenth_layers ++;
            if (parenth_layers === 1) {
                ret += open_char;
            }
        }
        else if (string[a] === close_char) {
            parenth_layers --;
            if(parenth_layers === 0) {
                ret += close_char;
            }
        }
        else {
            ret += string[a];
        }
    }
    return ret;
}

export function read_number(string: string, pos: number) {
    //Get to the first digit (or -)
    while (pos < string.length && (string[pos] < "0" || string[pos] > "9")
        && !(string[pos] === "-" && pos < string.length - 1 && string[pos + 1] >= "0" && string[pos + 1] <= "9")) {
        pos++;
    }
    let isNegative = false;
    if (string[pos] === "-") {
        pos++;
        isNegative = true;
    }
    let num = Number(string[pos]);
    pos++;
    //Read all subsequent digits
    while (pos < string.length && string[pos] >= "0" && string[pos] <= "9") {
        num *= 10;
        num += Number(string[pos]);
        pos++;
    }
    //Return the number you read, and the position of the first non-digit
    return { num: isNegative ? -num : num, pos: pos };
}

function words_in_bracket(string: string, start_at: number) {
    //Find start and end
    let open = -1, close = -1;
    for (let a = start_at; a < string.length; a++) {
        if (string[a] === "{" && open < 0) {
            open = a;
        }
        if (string[a] === "}" && open >= 0) {
            close = a;
            break;
        }
    }
    let in_brackets = string.substring(open + 1, close);
    let words = in_brackets.split(" ");
    return { words: words, pos: close };
}

export function pieces_in_bracket(string: string, start_at: number, piece_list: NameSymbol[]) {
    let all_words = words_in_bracket(string, start_at);
    let pieces: number[] = [];
    for (let b = 0; b < all_words.words.length; b++) {
        let piece_id = piece_list.findIndex(p => p.name === all_words.words[b]);
        if (piece_id < 0) {
            piece_id = piece_list.findIndex(p => p.symbol === all_words.words[b])
        }
        if (piece_id >= 0) {
            pieces.push(piece_id);
        }
    }
    return { pieces: pieces, pos: all_words.pos };
}

export function get_2_nums(string: string, start_at: number) {
    let data = words_in_bracket(string, start_at);
    let nums: number[] = [];
    for (let a = 0; a < data.words.length; a++) {
        if (!isNaN(Number(data.words[a]))) {
            nums.push(Number(data.words[a]));
        }
    }
    return { num1: nums[0], num2: nums[1], pos: data.pos };
}
export function get_2_zones(string: string, start_at: number, all_zones: Squareset[], width: number, height: number) {
    let data = words_in_bracket(string, start_at);
    let nums: number[] = [];
    for (let a = 0; a < data.words.length; a++) {
        nums.push(get_zone_and_push(data.words[a], all_zones, width, height));
    }
    return { num1: nums[0], num2: nums[1], pos: data.pos };
}
export function get_1_num(string: string, start_at: number) {
    let data = words_in_bracket(string, start_at);
    for (let a = 0; a < data.words.length; a++) {
        if (!isNaN(Number(data.words[a]))) {
            return { num: Number(data.words[a]), pos: data.pos };
        }
    }
    return { num: -1, pos: data.pos };
}

export function string_to_mol_num(string: string, mols: string[]) {
    if (!mols.includes(string)) {
        mols.push(string);
        return mols.length - 1;
    }
    return mols.findIndex(e => e === string);
}

export function to_magic_numbers(array: any[], reference: string[], name: string): number[] {
    let ret: number[] = [];
    for (let a = 0; a < array.length; a ++) {
        if (typeof (array[a]) === "string") {
            let index = reference.indexOf(array[a]);
            if (index === -1) {
                throw new Error(name+" not found: "+array[a]);
            }
            else {
                ret.push(index);
            }
        }
        else if (typeof(array[a]) === "number") {
            ret.push(array[a]);
        }
        else {
            throw new Error(name+" has unexpected value: "+array[a]);
        }
    }
    return ret;
}

//chars is array of characters
export function string_only_has_chars(string: string, chars: string[]): boolean {
    for (let a = 0; a < string.length; a ++) {
        if (!chars.includes(string[a])) {
            return false;
        }
    }
    return true;
}

function angle_to_diagonal(dx: number, dy: number): number {
    if (dx === dy && dy === 0) { return 0; }
    if (dx === 0) {
        return (dy < 0) ? 0 : 4;
    }
    if (dx > 0) {
        return (dy < 0) ? 7 : (dy === 0) ? 6 : 5;
    }
    if (dx < 0) {
        return (dy < 0) ? 1 : (dy === 0) ? 2 : 3;
    }
    return 0;
}
function angle_to_orthogonal(dx: number, dy: number): number {
    if (dx === dy && dy === 0) { return 0; }
    if (dy < -Math.abs(dx)) { return 0; }
    if (dy > Math.abs(dx)) { return 4; }
    if (dx < -Math.abs(dy)) { return 2; }
    if (dx > Math.abs(dy)) { return 6; }
    if (dx === dy)  { return (dx < 0) ? 1 : 5; }
    if (dx === -dy) { return (dx < 0) ? 3 : 7; }
    return 0;
}
function angle_to_clockwise(dx: number, dy: number): number {
    if (dx === dy && dy === 0) { return 0; }
    if (dx >= 0 && dy < 0) {
        if (Math.abs(dx) < Math.abs(dy)) { return 0; }
        else { return 7; }
    }
    if (dx > 0 && dy >= 0) {
        if (Math.abs(dx) > Math.abs(dy)) { return 6; }
        else { return 5; }
    }
    if (dx <= 0 && dy > 0) {
        if (Math.abs(dx) < Math.abs(dy)) { return 4; }
        else { return 3; }
    }
    if (dx < 0 && dy <= 0) {
        if (Math.abs(dx) > Math.abs(dy)) { return 2; }
        else { return 1; }
    }
    return 0;
}
function angle_to_counterclockwise(dx: number, dy: number): number {
    if (dx === dy && dy === 0) { return 0; }
    if (dx <= 0 && dy < 0) {
        return (dx <= dy) ? 1 : 0;
    }
    if (dx < 0 && dy >= 0) {
        return (dx < -dy) ? 2 : 3;
    }
    if (dx >= 0 && dy > 0) {
        return (dx >= dy) ? 5 : 4;
    }
    if (dx > 0 && dy <= 0) {
        return (dx > -dy) ? 6 : 7;
    }
    return 0;
}
export function angle_to(dx: number, dy: number, snap_mode?: string): number {
    switch (snap_mode) {
        case "diagonal":
            return angle_to_diagonal(dx, dy);
        case "orthogonal":
            return angle_to_orthogonal(dx, dy);
        case "counterclockwise":
            return angle_to_counterclockwise(dx, dy);
        default:
            return angle_to_clockwise(dx, dy);
    }
}

export function array_singles(item: any) {
    if(item === undefined || item === null) {
        return undefined;
    }
    return Array.isArray(item) ? item : [item];
}

//Converts zone ID, 1/0 string, or string preset (e.g. white_ranks_2) to Squareset
export function zone_to_squareset(zone: number | string | Squareset | number[], allZones: Squareset[], width: number, height: number): Squareset {
    if (typeof(zone) === "number" && allZones.length > zone) {
        return allZones[zone];
    }
    else if (typeof(zone) === "string" && !isNaN(Number(zone)) && zone.length < 3 && allZones.length > Number(zone)) {
        //Max 2 digits to prevent "000111000" to be read as a number
        return allZones[Number(zone)];
    }
    else if (typeof(zone) === 'string' && string_only_has_chars(zone, ["0", "1", " "])) {
        return squareset_from_string(width*height, zone);
    }
    else if (typeof(zone) === "string") {
        let zone_ss = new Squareset(width*height);
        if (zone.startsWith("white_ranks_")) {
            let number = Number(zone.substring(12));
            for (let a = 0; a < width*number; a ++) {
                zone_ss.set_on(width*height - 1 - a);
            }
        }
        else if (zone.startsWith("black_ranks_")) {
            let number = Number(zone.substring(12));
            for (let a = 0; a < width*number; a ++) {
                zone_ss.set_on(a);
            }
        }
        else if (zone.startsWith("white_rank_")) {
            let number = Number(zone.substring(11));
            for (let a = 0; a < width; a ++) {
                zone_ss.set_on(width*(height-number) + a);
            }
        }
        else if (zone.startsWith("black_rank_")) {
            let number = Number(zone.substring(11));
            for (let a = 0; a < width; a ++) {
                zone_ss.set_on(width*(number-1) + a);
            }
        }
        else if (zone === "white_palace") {
            let start_x = Math.floor((width-3)/2), start_y = height-3;
            for (let x = start_x; x < start_x+3; x ++) {
                for(let y = start_y; y < start_y+3; y ++) {
                    zone_ss.set_on(y*width+x);
                }
            }
        }
        else if (zone === "black_palace") {
            let start_x = Math.ceil((width-3)/2), start_y = 0;
            for (let x = start_x; x < start_x+3; x ++) {
                for(let y = start_y; y < start_y+3; y ++) {
                    zone_ss.set_on(y*width+x);
                }
            }
        }
        else if (zone === "all") {
            for (let a = 0; a < width*height; a ++) {
                zone_ss.set_on(a);
            }
        }
        else {
            throw new Error("Unknown zone: "+zone);
        }
        return zone_ss;
    }
    else if (Array.isArray(zone)) {
        let zone_ss = new Squareset(width * height);
        zone_ss.backingArray = [...zone];
        return zone_ss;
    }
    else if(typeof(zone) === "object") {
        return zone; //Assume it's already a ss
    }
    else {
        throw new Error("Zone not recognized: "+zone);
    }
}

//If the zone isn't in the array, it adds it. Either way, returns the index of the zone in the array.
export function get_zone_and_push(zone: number | string, all_zones: Squareset[], width: number, height: number): number {
    //Find the squareset corresponding to the zone
    let zone_ss: Squareset = zone_to_squareset(zone, all_zones, width, height);
    //Now check to see if it is in all_zones
    for (let a = 0; a < all_zones.length; a ++) { 
        let is_equal = true;
        for (let b = 0; b < all_zones[a].backingArray.length; b ++) {
            if (zone_ss.backingArray[b] === undefined || all_zones[a].backingArray[b] !== zone_ss.backingArray[b]) {
                is_equal = false;
            }
        }
        if (is_equal) {
            return a;
        }
    }
    //At this point, we found no matches. Add it to the array
    all_zones.push(zone_ss);
    return all_zones.length-1;
}

export interface NameSymbol {
    name: string,
    symbol: string
}
//Converts id, name, or symbol to id
export function name_to_piece_id(name: string | number, piece_list: NameSymbol[]) {
    //If you pass in a piece ID, just return it back
    if (typeof (name) === "number") {
        return name;
    }
    else if (typeof (name) === "string") {
        //Look for any pieces with specified name
        let num = piece_list.findIndex(e => e.name === name);
        if (num >= 0) {
            return num;
        }
        //Look for any pieces with specified symbol
        num = piece_list.findIndex(e => e.symbol === name);
        if (num >= 0) {
            return num;
        }
    }
    return -1;
}

//This isn't used anywhere, might delete
//If I keep it it needs to be updated a lot
export function stringify_consts(json: any) {
    let ret = JSON.parse(JSON.stringify(json));
    if (ret.wins) {
        for (let a = 0; a < ret.wins.length; a ++) {
            if (typeof(ret.wins[a]) === "number") {
                ret.wins[a] = wins_str[ret.wins[a]];
            }
        }
    }
    if (ret.draws) {
        for (let a = 0; a < ret.draws.length; a ++) {
            if (typeof(ret.draws[a]) === "number") {
                ret.draws[a] = draws_str[ret.draws[a]];
            }
        }
    }
    for (let a = 0; a < ret.all_pieces.length; a ++){
        let piece = ret.all_pieces[a];
        if (piece.promotions) {
            for (let b = 0; b < piece.promotions.length; b ++){
                for (let c = 0; c < piece.promotions[b].on.length; c ++) {
                    if (typeof(piece.promotions[b].on[c]) === "number") {
                        piece.promotions[b].on[c] = events_str[piece.promotions[b].on[c]];
                    }
                }
            }
        }
        if (piece.attributes) {
            for (let b = 0; b < piece.attributes.length; b ++) {
                if (typeof(piece.attributes[b]) === "number") {
                    piece.attributes[b] = attrib_str[piece.attributes[b]];
                }
            }
        }
    }
    return ret;
}

export function pxToNumber(s: string): number {
    return Number(s.substring(0, s.length-2));
}

export function elemHeight(cv: HTMLCanvasElement) {
    //return pxToNumber(cv.style.height);
    return cv.height;
}
export function elemWidth(cv: HTMLCanvasElement) {
    //return pxToNumber(cv.style.width);
    return cv.width;
}
export function downloadJson(data: any, name: string = "download.json") {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, undefined, 2));
    let newA = document.createElement("a");
    newA.setAttribute("href", dataStr);
    newA.setAttribute("download", name);
    newA.click();
    document.removeChild(newA);
}
export function downloadHjson(data: any, name: string = "download.hjson") {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(Hjson.stringify(data, undefined, 2));
    let newA = document.createElement("a");
    newA.setAttribute("href", dataStr);
    newA.setAttribute("download", name);
    newA.click();
    document.removeChild(newA);
}