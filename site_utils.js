function board_page() {
    document.getElementById("board_section").style.display = "block";
    document.getElementById("lobby_section").style.display = "none";
    document.getElementById("board_page_button").style.display = "none";
    document.getElementById("lobby_page_button").style.display = "block";
}
function lobby_page() {
    document.getElementById("board_section").style.display = "none";
    document.getElementById("lobby_section").style.display = "block";
    document.getElementById("board_page_button").style.display = "block";
    document.getElementById("lobby_page_button").style.display = "none";
}

function add_image(dname, fname) {
    if (!document.getElementById("img_" + fname)) {
        let img1 = new Image();
        img1.onerror = () => {
            show_error(`Error loading image '${fname}'`);
        }
        img1.src = "images/" + dname + "/" + fname + ".png";
        img1.id = "img_" + fname;
        document.getElementById("imageDiv").appendChild(img1);
    }
}

function add_pieces_then_reload(images) {
    images = [...new Set(images)];
    images = images.filter(e => !document.getElementById("img_" + e));
    let to_load = images.length;
    for (let a = 0; a < images.length; a++) {
        let img1 = new Image();
        img1.onload = function () {
            to_load--;
            if (to_load === 0) {
                render_entire_board();
            }
        }
        img1.onerror = () => {
            show_error(`Error loading image '${images[a]}'`);
        }
        img1.src = "images/pieces/" + images[a] + ".png";
        img1.id = "img_" + images[a];
        document.getElementById("imageDiv").appendChild(img1);
    }
}

function download_json(object) {
    //let str = JSON.stringify(stringify_consts(object), null, 2);
    let str = Hjson.stringify(stringify_consts(object));
    let file = new File([str], object.name);
    let url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = object.name+".hjson";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

function add_files_to_dropdown() {
    let variant_dropdown = document.getElementById("variantField");
    let category = document.getElementById("categoryField");
    let cat_num = Number(category.value);
    variant_dropdown.innerHTML = "";
    for (let a = 0; a < preset_variants[cat_num].length; a++) {
        let temp = new Option();
        temp.value = a;
        temp.innerHTML = DOMPurify.sanitize(preset_variants[cat_num][a].name);
        variant_dropdown.appendChild(temp);
    }
}

function download_variant() {
    if (last_loaded_board === undefined) {
        show_error("No board loaded");
    }
    else {
        download_json(last_loaded_board);
    }
}

function load_from_canon() {
    let category = Number(document.getElementById("categoryField").value);
    let variant = document.getElementById('variantField').value;
    start_game(preset_variants[category][variant]);
}

function load_from_file() {
    let file = document.getElementById("variant_file").files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            try {
                let n = file.name.toLowerCase();
                let game_object =
                    n.endsWith(".json") ? JSON.parse(evt.target.result) :
                    n.endsWith(".hjson")?Hjson.parse(evt.target.result) :
                    undefined;
                if(game_object) {
                    start_game(game_object, undefined, true)
                }
                else {
                    show_error("File not recognized");
                }
            }
            catch (error){
                show_error(error.message)
            }
        }
        reader.onerror = function () {
            show_error("Couldn't read the file");
        }
    }
    else {
        show_error("No file selected");
    }
}

function load_variant() {
    let load_from = document.getElementById("from_select").value;
    
    switch(load_from) {
        case "Canon":
            load_from_canon();
            break;
        case "File":
            load_from_file();
            break;
        case "Server":
            set_board(document.getElementById("from_server_code").value);
            break;
        case "Import code":
            import_history_firebase(document.getElementById("from_import_code").value);
            render_entire_board();
            break;
        default:
            show_error("Error loading variant, this should go in #bug-reports");
    }
}
function load_random_variant() {
    let all_variants = [];
    for (let a = 0; a < preset_variants.length; a ++) {
        for (let b = 0; b < preset_variants[a].length; b ++) {
            all_variants.push({a, b});
        }
    } 
    let index = Math.floor(Math.random()*all_variants.length);
    let category = all_variants[index].a, file = all_variants[index].b;
    start_game(preset_variants[category][file]);
}

function load_board_textures() {
    add_image("board", "sq_dark");
    add_image("board", "sq_light");
    add_image("board", "sq_canmove");
    add_image("board", "sq_canmove_potential");
    add_image("board", "sq_canmove_sel");
    add_image("board", "sq_canmove_turn");
    add_image("board", "hand_bg");
    add_image("board", "glow");
    add_image("board", "glow_check");
    add_image("board", "full_space");
    add_image("board", "attack_white");
    add_image("board", "attack_black");
    add_image("board", "movable");
}

function fix_canvas_height() {
    //Find and set canvas height
    let ratio = (game_data.height + (game_data.has_hand ? 2 : 0)) / game_data.width;
    let c0 = document.getElementById("board_canvas_0");
    let w = c0.width;
    for (let a = 0; a < 6; a ++) {
        let c = document.getElementById("board_canvas_"+a);
        c.width = w;
        c.height = w * ratio;
    }
    let container = document.getElementById("board_canvas_container");
    container.style.height = c0.height+4+"px";
    container.style.width = c0.width+4+"px";
    //Set history height
    let history = document.getElementById("history_div");
    // let h = Number(history.style.height.substring(0, history.style.height.length-2));
    // history.style.height = (c0.offsetHeight-history.offsetHeight+h)+"px";
    history.style.height = c0.height+4+"px";
}

function add_circle(circle) {
    if (circle.sq === undefined || circle.sq < 0) {
        return;
    }
    let index = circles.findIndex(e => e.sq === circle.sq);
    if (index != -1) {
        if (circles[index].col === line_col) {
            circles.splice(index, 1);
        }
        else {
            circles.splice(index, 1);
            circles.push(circle);
        }
    }
    else {
        circles.push(circle);
    }
    render_circles_and_lines();
}
//Line is an object like {sq1: number, sq2: number}
function add_line(line) {
    let max = game_data.width * game_data.height;
    if(line === undefined || line.sq1 < 0 || line.sq1 >=  max || line.sq2 < 0 || line.sq2 >= max) {
        return;
    }
    let index = lines.findIndex(e => (e.sq1 === line.sq1 && e.sq2 === line.sq2));
    if (index > -1) {
        if (lines[index].col === line_col) {
            lines.splice(index, 1);
        }
        else {
            lines.splice(index, 1);
            lines.push(line);
        }
    }
    else {
        lines.push(line);
    }
    render_circles_and_lines();
}
function clear_lines_circles() {
    lines = [];
    circles = [];
    render_circles_and_lines();
}


function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

function open_modal(name) {
    document.getElementById("modal-"+name).showModal();
}
function close_modal(name) {
    document.getElementById("modal-"+name).close();
}