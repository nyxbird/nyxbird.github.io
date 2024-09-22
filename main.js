let COL_NUM = 3;
let COL_ROOM = 100;
let COL_THRESH = 600;

let tag_colors = {
    "dev": "#adb",
    "web": "#abd",
    "fun": "#dba",
    "sol": "#cca",
    "art": "#bad",
    "cpp": "#ccc",
    "wip": "#aaa"
}

function tag_link(tag) {
    return `<a class="boxtag" style="color:${tag_colors[tag]}" href="?tag=${tag}">#${tag}</a>`;
}

function make_box(box) {
    let b = document.createElement("a");
    b.setAttribute("class", "box");

    if(box.link) {
        b.setAttribute("class", b.getAttribute("class")+" clickable");
        b.setAttribute("href", box.link);
    }

    if(box.title) {
        let title = document.createElement("div");
        title.setAttribute("class", "boxtitle");
        title.innerText = box.title;
        b.appendChild(title);
    }

    if(box.image) {
        let image = document.createElement("img");
        image.setAttribute("class", "thumbnail");
        image.setAttribute("src", box.image);
        b.appendChild(image);
    }

    if(box.blurb) {
        let blurb = document.createElement("p");
        blurb.innerText = box.blurb;
        b.appendChild(blurb);
    }

    if(box.tags) {
        let tags = document.createElement("div");
        tags.setAttribute("class", "boxtags");
        for(let j = 0; j < box.tags.length; ++j) {
            let t = box.tags[j];
            let tag = document.createElement("a");
            tag.setAttribute("class", "boxtag");
            // tag.style.color = tag_colors[t];
            tag.style.setProperty("--tag-color", tag_colors[t]);
            tag.href = `?tag=${t}`;
            tag.innerText = `#${t}`;
            tags.appendChild(tag);
        }

        b.appendChild(tags);
    }

    return b;
}

function clear_grid() {
    let grid = document.getElementById("boxgrid");
    grid.replaceChildren();
}

function fill_grid() {
    console.log("!");
    const params = new URLSearchParams(window.location.search);
    let req = box=>{return true};
    if(params.has("tag")) {
        req = box=>{
            for(let tag of box.tags) {
                if(tag == params.get("tag")) return true;
            }
            return false;
        };
    }

    let grid = document.getElementById("boxgrid");
    // alert(grid);
    for(let i = 0; i < COL_NUM; ++i) {
        let col = document.createElement("div");
        col.setAttribute("class", "boxcol");
        grid.appendChild(col);
    }
    let col = 0;
    for(let i = 0; i < boxes.length; ++i) {
        if(!req(boxes[i])) continue;
        let box = make_box(boxes[i]);
        grid.children[col].appendChild(box);
        ++col;
        col %= COL_NUM;
    }
}

function regrid() {
    if(window.innerWidth < COL_THRESH * COL_NUM && COL_NUM > 1) {
        COL_NUM = Math.floor(window.innerWidth/COL_THRESH);
        clear_grid();
        fill_grid();
    }
    if(window.innerWidth > COL_THRESH * (COL_NUM+1)) {
        COL_NUM = Math.floor(window.innerWidth/COL_THRESH);
        clear_grid();
        fill_grid();
    }
}


addEventListener("load", ()=>{fill_grid(); regrid();});
addEventListener("resize", regrid);