let all_boards_ref = firebase.database().ref(`boards`);
function set_board(board_name) {
    all_boards_ref.child(board_name).once("value", (snapshot) => {
        let this_board = snapshot.val();
        if (!this_board) {
            console.error("Trying to start a non-existent board");
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
let my_ver_ref, other_ver_ref;
let my_prop_ref, other_prop_ref;
let my_prop;


function multiplayer_make_move(src_x, src_y, dst_x, dst_y, prom) {
    if(!in_multiplayer_game) {
        console.error("Trying to make multiplayer move when not in a room");
    }
    let data = {src_x, src_y, dst_x, dst_y};
    if(prom != undefined) {
        data.prom = prom;
    }
    my_prop_ref.set(data);
    my_prop = data;
}

function multiplayer_make_drop(piece, color, dest) {
    if(!in_multiplayer_game) {
        console.error("Trying to make multiplayer drop when not in a room");
    }
    let data = {piece, color, dest};
    my_prop_ref.set(data);
    my_prop = data;
}

//Pulls name automatically from name_input field
function set_name() {
    let new_name = document.getElementById("name_input").value;
    if (typeof(new_name) === "string") {
        user_ref.update({name: new_name});
    }
}

function close_match() {
    //Todo: Archive the match
    my_match_ref.set({});
}

function switch_to_single_player() {
    in_multiplayer_game = false;
    my_ver_ref = undefined;
    other_ver_ref = undefined;
    my_prop_ref = undefined;
    other_prop_ref = undefined;
    my_prop = undefined;
    my_match = undefined;
    my_match_ref = undefined;
    my_col = undefined;
    render_extras();
}

let other_prop_change = (snapshot) => {
    let other_prop = snapshot.val();
    if (!other_prop) {
        my_ver_ref.set({});
        return;
    }
    if (other_prop.piece != undefined && other_prop.color != undefined && other_prop.dest != undefined) {
        //Drop move
        let valid = validate_drop(other_prop.piece, other_prop.color, other_prop.dest);
        if (board.turn === my_col || other_prop.color === my_col) {
            valid = false;
        }
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
            console.log("Opponent attempted invalid drop move");
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
            console.log("Opponent attempted invalid move");
        }
    }
}
let other_ver_change = (snapshot) => {
    let other_ver = snapshot.val();
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
                    switch_to_single_player();
                }
                render_board();
            }
        }
        else if (my_prop.src_x != undefined && my_prop.src_y != undefined && my_prop.dst_x != undefined && my_prop.dst_y != undefined) {
            if (my_prop.src_x === other_ver.src_x && my_prop.src_y === other_ver.src_y && my_prop.dst_x === other_ver.dst_x && my_prop.dst_y === other_ver.dst_y) {
                make_move(my_prop.src_x, my_prop.src_y, my_prop.dst_x, my_prop.dst_y, my_prop.prom);
                if(find_victory() >= 0) {
                    close_match();
                    switch_to_single_player();
                }
                render_board();
            }
        }
    }
    else {
        //Todo: Notify client that the last move was invalid
        console.log("Your last attempted move was automatically flagged as invalid by the opponent")
    }
    my_prop = {};
    my_prop_ref.set({});
}

function join_game(match_id) {
    if(in_multiplayer_game) {
        return;
    }
    let t_match_ref = firebase.database().ref(`lobby/${match_id}`);
    let skip = false;
    t_match_ref.on("value", (snapshot) => {
        if(skip) {return;} //To avoid double-dipping on value changes
        skip = true;
        let t_match = snapshot.val();
        if(t_match.owner === user_id) {
            console.error("Attempting to join your own game");
            return; //Can't join your own match
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
        my_match_ref.set({
            board_name: t_match.board_name,
            owner_col,
            owner: t_match.owner,
            owner_name: t_match.owner_name,
            joiner: user_id,
            joiner_name: this_user.name,
            joiner_col: !owner_col
        });
        in_multiplayer_game = true;
        my_col = !owner_col;
        style_data.flip_board = my_col;
        my_name = this_user.name;
        opp_name = t_match.owner_name;
        let is_owner = (t_match.owner === user_id);
        my_prop_ref = my_match_ref.child(is_owner?'owner_proposed':'joiner_proposed');
        my_ver_ref  = my_match_ref.child(is_owner?'owner_verified':'joiner_verified');
        other_prop_ref = my_match_ref.child(is_owner?'joiner_proposed':'owner_proposed');
        other_ver_ref  = my_match_ref.child(is_owner?'joiner_verified':'owner_verified');
        other_prop_ref.on("value", other_prop_change);
        other_ver_ref.on("value", other_ver_change);
        t_match_ref.update({goto: my_match_ref.key, joiner_name: this_user.name, owner_col});
        t_match_ref = undefined;
        set_board(t_match.board_name);
        board_page();
    });
    //t_match_ref.update({joiner: user_id, joiner_name: this_user.name});
}

function add_lobby() {
    if(in_multiplayer_game) {
        return;
    }
    let board_name = document.getElementById("board_name").value;
    let owner_col = "r";
    all_boards_ref.child(`${board_name}/height`).once("value", (snapshot) => {
        //Check if this board exists
        if(!snapshot.val()) {
            //Todo: Show error to user
            console.error("Trying to create lobby with non-existent board");
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
                let is_owner = (val.owner === user_id);
                my_prop_ref = my_match_ref.child(is_owner?'owner_proposed':'joiner_proposed');
                my_ver_ref  = my_match_ref.child(is_owner?'owner_verified':'joiner_verified');
                other_prop_ref = my_match_ref.child(is_owner?'joiner_proposed':'owner_proposed');
                other_ver_ref  = my_match_ref.child(is_owner?'joiner_verified':'owner_verified');
                other_prop_ref.on("value", other_prop_change);
                other_ver_ref.on("value", other_ver_change);
                set_board(val.board_name);
                board_page();
                lobby_ref.remove();
            }
        });
    });
}

let lobby_ref = firebase.database().ref(`lobby`);
lobby_ref.on("value", (snapshot) => {
    let table = document.getElementById("lobby_table");
    table.innerHTML = `
    <tr>
        <th>Board Name</th>
        <th>Creator</th>
        <th>Join</th>
    </tr>`;
    let lobby = snapshot.val();
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
    //console.log(user);
    if(user) {
        //console.log("Logged in");
        user_id = user.uid;
        user_ref = firebase.database().ref(`users/${user_id}`);

        user_ref.on("value", (snapshot) => {
            this_user = snapshot.val();
            let name_p = document.getElementById("name_p");
            name_p.innerHTML = "Name: "+this_user.name;
        });
        
        user_ref.set({
            id: user_id,
            name: "Guest"
        });

        user_ref.onDisconnect().remove();
    }
    else {
        //console.log("Logged out");
    }
});

firebase.auth().signInAnonymously().catch((error) => {
    console.log(error.code, error.message);
});