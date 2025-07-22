// shaders!!! yayyyy!!!!
let canvas, ctx, gl;
let loaded = false;
let mouse = {x:0, y:0};
let ripple = {x:0, y:0};
let last_time = 0;

// shader vars
let program, pos_buffer;
let a_pos, u_res, u_mouse, u_time;
let time_off = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function mousemove(e) {
    mouse = {x:e.clientX, y:gl.canvas.height-e.clientY};
}

function update_ripple(dt) {
    ripple.x = ripple.x*.9+mouse.x*.1;
    ripple.y = ripple.y*.9+mouse.y*.1;
    // ripple.x = ripple.x/2+mouse.x/2;
    // ripple.y = ripple.y/2+mouse.y/2;
}

function render(time) {
    // if(0) {
    if(gl) {
        let dt = time-last_time;

        resize();
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.useProgram(program);

        gl.enableVertexAttribArray(a_pos);
        gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer);
        
        gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(u_res, gl.canvas.width, gl.canvas.height);
        // gl.uniform2f(u_mouse, mouse.x, mouse.y);
        update_ripple(dt);
        gl.uniform2f(u_mouse, ripple.x, ripple.y);
        gl.uniform1f(u_time, time*0.0001+time_off);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        last_time = time;
        requestAnimationFrame(render);
    }
}

// hook onto existing onload
let onload = window.onload??(()=>{});
window.onload=()=>{
    onload();
    canvas = document.getElementById("bg");
    // resize();
    // ctx = canvas.getContext("2d");
    gl = canvas.getContext("webgl");

    window.addEventListener("mousemove", mousemove);

    if(gl) {
        program = createProgram(gl,
            createShader(gl, gl.VERTEX_SHADER, vert_shader),
            createShader(gl, gl.FRAGMENT_SHADER, frag_shader)
        );

        a_pos = gl.getAttribLocation(program, "a_pos");
        u_res = gl.getUniformLocation(program, "iResolution");
        u_mouse = gl.getUniformLocation(program, "iMouse");
        u_time = gl.getUniformLocation(program, "iTime");

        pos_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, 1, 1, 1, 1, -1,
            1, -1, -1, -1, -1, 1
        ]), gl.STATIC_DRAW);
        
        time_off = Math.random()*10000+5000;
        render();
    }
    loaded = true;
}