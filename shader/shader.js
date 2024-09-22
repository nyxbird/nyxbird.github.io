let vert_shader = `
attribute vec4 a_pos;
void main() {
    gl_Position = a_pos;
}
`

let frag_shader = `
precision highp float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

float rand(float i) {
    return fract(sin(i)*100000.);
}

float rand(float i, float n) {
    return fract(sin(i)*100000.*(1.+rand(n)));
}

float rand(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float sm(float t) {
    return t*t*(3.-2.*t);
}

float noise(float i) {
    return mix(rand(floor(i)), rand(floor(i)+1.), sm(fract(i)));
}

float noise(float i, float n) {
    return mix(rand(floor(i), n), rand(floor(i)+1., n), sm(fract(i)));
}

void mainImage(out vec4 col, in vec2 pos) {
    vec2 st = pos/iResolution.yy;
    float ar = iResolution.x/iResolution.y;
    float a = 0.;
    float t = iTime/10.+100.;
    for(int i = 0; i < 18; ++i) {
        vec2 c = vec2(ar*noise(t, float(i)),noise(t+500.5, float(i)));   
        a += pow(1./length(c-st),1.);
    }
    for(int i = 0; i < 18; ++i) {
        vec2 c = vec2(ar*noise(t, float(i)+100.),noise(t+500.5, float(i)+100.));   
        a -= pow(1./length(c-st),1.);
    }
    
    a *= pow(length(iMouse.xy/iResolution.yy-st),0.5);
    
    float xhigh = 10., high = 5., low = 1.5;
    
    if(a>=xhigh) {col = vec4(.25, .1, .55, 1.);}
    else if(a>=high) {col = vec4(.2, .1, .4, 1.);}
    else if(a>=low) {col = vec4(.15, .1, .25, 1.);}
    else if(a>=-low) {col = vec4(.1, .1, .1, 1.);}
    else if(a>=-high) {col = vec4(.2, .1, .2, 1.);}
    else if(a>=-xhigh) {col = vec4(.3, .1, .3, 1.);}
    else {col = vec4(.4, .1, .4, 1.);}
}

void main() {
    // gl_FragColor = vec4(fract((gl_FragCoord.xy-u_mouse) / u_res), fract(u_time), 1.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}