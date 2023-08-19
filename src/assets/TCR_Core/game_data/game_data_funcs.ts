import { preset_move_types } from "../Constants";
import { Squareset } from "../Squareset";
import { get_slide_ss } from "../bnb_ep_init";
import { remove_nested_parenthases } from "../utils";
import { GameData } from "./GameData";

// export function _generate_1_move_ss(this: GameData, string_orig: string, pos: number, angle: number) {
//     let string = string_orig;
//     for(let i = 0; i < preset_move_types.length; i ++) {
//         string = string.replaceAll(preset_move_types[i].a, preset_move_types[i].b)
//     }
//     string = remove_nested_parenthases(string);

//     let pos_x = pos % this.width;
//     let pos_y = Math.floor(pos / this.width);

//     if (string === "U") {
//         return this.active_squares;
//     }
//     if (string.includes("(")) {
//         //Add up several get_slide_ss calls
//         let ret = new Squareset(this.width*this.height);
//         let move_list = string.substring(1, string.length - 1).split(",");
//         for (let a = 0; a < move_list.length; a++) {
//             let nums = move_list[a].substring(1, move_list[a].length - 1).split(" ");
//             ret.ore(get_slide_ss(pos_x, pos_y, Number(nums[0]), Number(nums[1]), angle, Number(nums[2]), Number(nums[3])));
//         }
//         return ret;
//     }
//     //Add one get_slide_ss to the array
//     let nums = string.substring(1, string.length - 1).split(" ");
//     return get_slide_ss(pos_x, pos_y, Number(nums[0]), Number(nums[1]), angle, Number(nums[2]), Number(nums[3]));
// }


export function _on_board(game_data: GameData, x: number, y?: number): boolean {
    if (y === undefined) {
        //Only square id given
        y = Math.floor(x / game_data.width);
        x %= game_data.width;
    }
    return x >= 0 && y >= 0 && x < game_data.width && y < game_data.height && 
    game_data.active_squares.get(y * game_data.width + x);
}

export function _generate_move_ss(game_data: GameData, string: string) {
    for(let i = 0; i < preset_move_types.length; i ++) {
        string = string.replaceAll(preset_move_types[i].a, preset_move_types[i].b)
    }
    string = remove_nested_parenthases(string);

    let ret: Squareset[][] = [];
    if (string === "U") {
        //Every element is a reference of all active squares on the board
        for (let a = 0; a < game_data.width * game_data.height; a++) {
            ret.push([]);
            for (let b = 0; b < 8; b++) {
                ret[a].push(game_data.active_squares);
            }
        }
    } else if (string.includes("(")) {
        //Add up several get_slide_ss calls
        let move_list = string.substring(1, string.length - 1).split(",");
        for (let pos = 0; pos < game_data.width * game_data.height; pos++) {
            let pos_x = pos % game_data.width;
            let pos_y = Math.floor(pos / game_data.width);
            ret.push([]);
            for (let angle = 0; angle < 8; angle++) {
                ret[pos][angle] = new Squareset(game_data.width*game_data.height);
                for (let a = 0; a < move_list.length; a++) {
                    let nums = move_list[a].substring(1, move_list[a].length - 1).split(" ");
                    ret[pos][angle].ore(get_slide_ss(pos_x, pos_y, Number(nums[0]), Number(nums[1]), angle, Number(nums[2]), Number(nums[3]), game_data));
                }
            }
        }
    } else {
        //Add one get_slide_ss to the array
        let nums = string.substring(1, string.length - 1).split(" ");
        for (let pos = 0; pos < game_data.width * game_data.height; pos++) {
            let pos_x = pos % game_data.width;
            let pos_y = Math.floor(pos / game_data.width);
            ret.push([]);
            for (let angle = 0; angle < 8; angle++) {
                ret[pos][angle] = (get_slide_ss(pos_x, pos_y, Number(nums[0]), Number(nums[1]), angle, Number(nums[2]), Number(nums[3]), game_data));
            }
        }
    }
    return ret;
}

//Gets the zone (squareset) to drop the specified piece/color to
//Considers board.drop_to_zone and piece.drop_to_zone
export function _get_drop_zone(game_data: GameData, piece_id: number, color: boolean): Squareset {
    let zone_id: number = -1;
    let piece = game_data.all_pieces[piece_id];
    if (piece.drop_to_zone != undefined && typeof(piece.drop_to_zone.white) === "number") {
        zone_id = color ? piece.drop_to_zone.black : piece.drop_to_zone.white;
    }
    else if (game_data.drop_to_zone != undefined && typeof(game_data.drop_to_zone.white) === "number") {
        zone_id = color ? game_data.drop_to_zone.black : game_data.drop_to_zone.white;
    }
    else {
        return game_data.active_squares;
    }
    if (game_data.zones.length <= zone_id || zone_id < 0) {
        throw new Error(`Zone ${zone_id} is undefined (found in drop_to_zone for ${game_data.all_pieces[piece_id].name})`)
    }
    return game_data.zones[zone_id];
}
