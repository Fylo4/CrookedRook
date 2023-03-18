let verbose_db_set = true;
let verbose_db_get = true;
//This is just an estimate and doesn't include overhead
let total_bytes_fetched = 0;

function show_db_set(message) {
    if (verbose_db_set) {
        console.log("db_set: "+message);
    }
}
function show_db_get(message, data) {
    let len = JSON.stringify(data).length;
    total_bytes_fetched += len;
    if(verbose_db_get) {
        console.log(`db_get: ${message} (size: ${len}, total: ${total_bytes_fetched})`);
    }
}
//Todo: Make these show up on the website
function show_error(message) {
    console.error(message);
}
function show_message (message) {
    console.log(message);
}

let all_boards_ref = firebase.database().ref(`boards`);
function set_board(board_name) {
    all_boards_ref.child(board_name).once("value", (snapshot) => {
        let this_board = snapshot.val();
        show_db_get(`Getting boards/${board_name}`, this_board);
        if (!this_board) {
            show_error("Trying to start a non-existent board");
        }
        start_game(this_board);
    });
}

let all_matches;
let all_matches_ref;

let user_id;
let user_ref;
let this_user;

let in_multiplayer_game = false;
let my_match_ref;
let my_match;
let my_col;
let my_name, opp_name;
let my_match_data, other_match_data;
let my_ver_ref, other_ver_ref;
let my_prop_ref, other_prop_ref;
let my_res_ref, other_res_ref;
let my_prop;


function multiplayer_make_move(src_x, src_y, dst_x, dst_y, prom) {
    if(!in_multiplayer_game) {
        show_error("Trying to make multiplayer move when not in a room");
    }
    let data = {src_x, src_y, dst_x, dst_y};
    if(prom != undefined) {
        data.prom = prom;
    }
    show_db_set("Setting my_prop (move)");
    my_prop_ref.set(data);
    my_prop = data;
}

function multiplayer_make_drop(piece, color, dest) {
    if(!in_multiplayer_game) {
        show_error("Trying to make multiplayer drop when not in a room");
    }
    let data = {piece, color, dest};
    show_db_set("Setting my_prop (drop)");
    my_prop_ref.set(data);
    my_prop = data;
}

function resign() {
    if(in_multiplayer_game && my_res_ref) {
        show_db_set("Setting my resign");
        my_res_ref.set(true);
        switch_to_single_player();
    }
}

//Pulls name automatically from name_input field
function set_name() {
    let new_name = document.getElementById("name_input").value;
    if (typeof(new_name) === "string") {
        show_db_set("Updating my name");
        user_ref.update({name: new_name});
    }
}

function close_match() {
    //Todo: Archive the match
    show_db_set("Setting my_match to close the match")
    my_match_ref.set({});
    switch_to_single_player();
}

function switch_to_single_player() {
    console.log("Switching to singleplayer mode");
    in_multiplayer_game = false;
    my_ver_ref = undefined;
    other_ver_ref = undefined;
    my_prop_ref = undefined;
    other_prop_ref = undefined;
    my_res_ref = undefined;
    other_res_ref = undefined;
    my_prop = undefined;
    my_match = undefined;
    my_match_ref = undefined;
    my_col = undefined;
    render_extras();
}

let on_opp_resign = (snapshot) => {
    if(snapshot.val() === true && in_multiplayer_game) {
        in_multiplayer_game = false;
        show_message("Opponent resigned");
        close_match();
    }
}

let other_prop_change = (snapshot) => {
    let other_prop = snapshot.val();
    show_db_get(`Getting other_prop`, other_prop)
    if (!other_prop) {
        show_db_set("Setting my_ver to empty")
        my_ver_ref.set({});
        return;
    }
    if (other_prop.piece != undefined && other_prop.color != undefined && other_prop.dest != undefined) {
        //Drop move
        let valid = validate_drop(other_prop.piece, other_prop.color, other_prop.dest);
        if (board.turn === my_col || other_prop.color === my_col) {
            valid = false;
        }
        show_db_set("Setting my_ver to verify drop move")
        my_ver_ref.set({valid, piece: other_prop.piece, color: other_prop.color, dest: other_prop.dest});
        if (valid) {
            make_drop_move(other_prop.piece, other_prop.color, other_prop.dest);
            if(find_victory() >= 0) {
                switch_to_single_player();
            }
            render_board();
        }
        else {
            //Todo: Report invalid move
            show_message("Opponent attempted invalid drop move, but it was blocked");
        }
    }
    else if (other_prop.src_x != undefined && other_prop.src_y != undefined && other_prop.dst_x != undefined && other_prop.dst_y != undefined) {
        //Move move
        let valid = validate_move(other_prop.src_x, other_prop.src_y, other_prop.dst_x, other_prop.dst_y);
        let src_sq = other_prop.src_x+other_prop.src_y*game_data.width;
        if (board.turn === my_col ||
            (!my_col && !board.black_ss.get(src_sq)) ||
            ( my_col && !board.white_ss.get(src_sq))) {
            valid = false;
        }
        let data = {valid, src_x: other_prop.src_x, src_y: other_prop.src_y, dst_x: other_prop.dst_x, dst_y: other_prop.dst_y};
        if (other_prop.prom != undefined) {
            data.prom = other_prop.prom;
        }
        show_db_set("Setting my_ver to verify move")
        my_ver_ref.set(data);
        if (valid) {
            make_move(other_prop.src_x, other_prop.src_y, other_prop.dst_x, other_prop.dst_y, other_prop.prom);
            if(find_victory() >= 0) {
                switch_to_single_player();
            }
            render_board();
        }
        else {
            //Todo: Report invalid move
            show_message("Opponent attempted invalid move, but it was blocked");
        }
    }
}
let other_ver_change = (snapshot) => {
    let other_ver = snapshot.val();
    show_db_get("Getting other_ver", other_ver);
    if (!other_ver) {
        return;
    }
    if (other_ver.valid) {
        //First make sure prop and ver are the same move
        if (my_prop.piece != undefined && my_prop.color != undefined && my_prop.dest != undefined) {
            if (my_prop.piece === other_ver.piece && my_prop.color === other_ver.color && my_prop.dest === other_ver.dest) {
                make_drop_move(my_prop.piece, my_prop.color, my_prop.dest);
                if(find_victory() >= 0) {
                    close_match();
                }
                render_board();
            }
        }
        else if (my_prop.src_x != undefined && my_prop.src_y != undefined && my_prop.dst_x != undefined && my_prop.dst_y != undefined) {
            if (my_prop.src_x === other_ver.src_x && my_prop.src_y === other_ver.src_y && my_prop.dst_x === other_ver.dst_x && my_prop.dst_y === other_ver.dst_y) {
                make_move(my_prop.src_x, my_prop.src_y, my_prop.dst_x, my_prop.dst_y, my_prop.prom);
                if(find_victory() >= 0) {
                    close_match();
                }
                render_board();
            }
        }
    }
    else {
        show_message("Your last attempted move was automatically flagged as invalid by the opponent")
    }
    my_prop = {};
    if(my_prop_ref) {
        show_db_set("Setting my_prop to empty")
        my_prop_ref.set({});
    }
    else {
        show_error("my_prop_ref is undefined")
    }
}

function join_game(match_id) {
    if(in_multiplayer_game) {
        return;
    }
    let t_match_ref = firebase.database().ref(`lobby/${match_id}`);
    t_match_ref.once("value", (snapshot) => {
        let t_match = snapshot.val();
        show_db_get("Getting lobby info", t_match)
        if (!t_match) {
            show_error("Trying to join a non-existent match");
            return;
        }
        if (t_match.owner === user_id) {
            show_error("Attempting to join your own game");
            return;
        }
        let owner_col;
        switch(t_match.owner_col) {
            case 'w':
                owner_col = false;
                break;
            case 'b':
                owner_col = true;
                break;
            case 'r':
                owner_col = (Math.random() < 0.5);
                break;
        }
        my_match_ref = firebase.database().ref(`match`).push();
        show_db_set("Setting my_match to join the game");
        my_match_ref.set({
            board_name: t_match.board_name,
            j: {
                name: this_user.name,
                uid: user_id,
                col: !owner_col
            },
            o: {
                col: owner_col,
                uid: t_match.owner,
                name: t_match.owner_name
            }
        });
        in_multiplayer_game = true;
        my_col = !owner_col;
        style_data.flip_board = my_col;
        my_name = this_user.name;
        opp_name = t_match.owner_name;
        let is_owner = (t_match.owner === user_id); //Should be false
        my_prop_ref = my_match_ref.child(is_owner?'o':'j').child('prop');
        my_ver_ref  = my_match_ref.child(is_owner?'o':'j').child('ver');
        other_prop_ref = my_match_ref.child(is_owner?'j':'o').child('prop');
        other_ver_ref  = my_match_ref.child(is_owner?'j':'o').child('ver');
        my_res_ref = my_match_ref.child(is_owner?'o':'j').child('res');
        other_res_ref  = my_match_ref.child(is_owner?'j':'o').child('res');
        other_prop_ref.on("value", other_prop_change);
        other_ver_ref.on("value", other_ver_change);
        other_res_ref.on("value", on_opp_resign);
        show_db_set("Updating lobby entry to start match")
        t_match_ref.update({goto: my_match_ref.key, joiner_name: this_user.name, owner_col});
        t_match_ref = undefined;
        set_board(t_match.board_name);
        board_page();
    });
}

function add_lobby() {
    if(in_multiplayer_game) {
        return;
    }
    let board_name = document.getElementById("board_name").value;
    let owner_col = "r";
    //Check if this board exists
    all_boards_ref.child(`${board_name}/height`).once("value", (snapshot) => {
        show_db_get("Checking if board exists", snapshot.val());
        if(!snapshot.val()) {
            show_error("Trying to create lobby with non-existent board");
            return;
        }
        let lobby_ref = firebase.database().ref(`lobby`).push({
            board_name,
            owner_col,
            owner: user_id,
            owner_name: this_user.name
        });
        lobby_ref.on("value", (snapshot) => {
            let val = snapshot.val();
            show_db_get("Getting lobby info", val)
            if(!val) {
                return;
            }
            if(val.goto) {
                //Join the game
                my_match_ref = firebase.database().ref(`match/${val.goto}`);
                in_multiplayer_game = true;
                my_col = val.owner_col;
                style_data.flip_board = my_col;
                my_name = val.owner_name;
                opp_name = val.joiner_name;
                let is_owner = (val.owner === user_id); //Should be true
                my_prop_ref = my_match_ref.child(is_owner?'o':'j').child('prop');
                my_ver_ref  = my_match_ref.child(is_owner?'o':'j').child('ver');
                other_prop_ref = my_match_ref.child(is_owner?'j':'o').child('prop');
                other_ver_ref  = my_match_ref.child(is_owner?'j':'o').child('ver');
                my_res_ref = my_match_ref.child(is_owner?'o':'j').child('res');
                other_res_ref  = my_match_ref.child(is_owner?'j':'o').child('res');
                other_prop_ref.on("value", other_prop_change);
                other_ver_ref.on("value", other_ver_change);
                other_res_ref.on("value", on_opp_resign);
                set_board(val.board_name);
                board_page();
                lobby_ref.remove();
            }
        });
    });
}

let all_lobbies_ref = firebase.database().ref(`lobby`);
all_lobbies_ref.on("value", (snapshot) => {
    let lobby = snapshot.val();
    show_db_get("Updating lobby info for table", lobby)
    let table = document.getElementById("lobby_table");
    table.innerHTML = `
    <tr>
        <th>Board Name</th>
        <th>Creator</th>
        <th>Join</th>
    </tr>`;
    for(let row in lobby) {
        let row_v = lobby[row];
        table.innerHTML += `
        <tr>
            <td>${row_v.board_name}</td>
            <td>${row_v.owner_name}</td>
            <td><button onclick="join_game('${row}')">Join</button></td>
        </tr>`;
    }
});


firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        user_id = user.uid;
        user_ref = firebase.database().ref(`users/${user_id}`);

        user_ref.on("value", (snapshot) => {
            this_user = snapshot.val();
            if(!this_user) {
                console.warn("This user is undefined. This is normal.")
            }
            else {
                show_db_get("Getting my user info", this_user);
                let name_p = document.getElementById("name_p");
                name_p.innerHTML = "Name: "+this_user.name;
            }
        });
        
        show_db_set("Setting my user id and name");
        user_ref.set({
            id: user_id,
            name: "Guest"
        });

        user_ref.onDisconnect().remove();
    }
    else {
        //Logged out
    }
});

firebase.auth().signInAnonymously().catch((error) => {
    show_error(error.code, error.message);
});