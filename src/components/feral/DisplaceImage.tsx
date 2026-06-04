import { useEffect, useRef } from "react";

/**
 * L1 technique — WebGL hover displacement.
 * A single-texture fragment shader warps the image toward the cursor and splits
 * RGB on hover (chromatic aberration), easing in/out. Self-contained: no second
 * displacement-map texture needed. Degrades to a plain <img> if WebGL or the
 * image fails — so it can never break a page. This is the "how did they do that"
 * tell, harvested into one drop-in component that speaks the kit's conventions.
 */
export default function DisplaceImage({
  src, alt = "", className, style,
}: { src: string; alt?: string; className?: string; style?: React.CSSProperties }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const gl = cv.getContext("webgl", { premultipliedAlpha: false, antialias: true });
    if (!gl) return; // fallback <img> stays visible

    const vert = `attribute vec2 p; varying vec2 uv;
      void main(){ uv = p*0.5+0.5; uv.y = 1.0-uv.y; gl_Position = vec4(p,0.0,1.0); }`;
    const frag = `precision highp float; varying vec2 uv;
      uniform sampler2D tex; uniform vec2 mouse; uniform float hover;
      uniform vec2 res; uniform vec2 imgRes;
      vec2 cover(vec2 u){
        float ca = res.x/res.y, ia = imgRes.x/imgRes.y;
        vec2 s = ca > ia ? vec2(1.0, ia/ca) : vec2(ca/ia, 1.0);
        return (u-0.5)/s + 0.5;
      }
      void main(){
        vec2 cu = cover(uv);
        float d = distance(uv, mouse);
        float pull = hover * smoothstep(0.45, 0.0, d) * 0.12;
        vec2 dir = normalize(cu - mouse + 0.0001);
        vec2 du = cu - dir * pull;
        float ca = hover * smoothstep(0.5,0.0,d) * 0.012;
        float r = texture2D(tex, du + vec2(ca,0.0)).r;
        float g = texture2D(tex, du).g;
        float b = texture2D(tex, du - vec2(ca,0.0)).b;
        gl_FragColor = vec4(r,g,b,1.0);
      }`;

    const sh = (t: number, s: string) => {
      const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); return o;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const pl = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(pl);
    gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let imgRes = [1, 1];
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      imgRes = [image.naturalWidth, image.naturalHeight];
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      if (img.current) img.current.style.opacity = "0"; // reveal canvas
    };
    image.onerror = () => { /* keep <img> fallback */ };
    image.src = src;

    let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5, hover = 0, thover = 0, raf = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
    };
    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      tmx = (e.clientX - r.left) / r.width; tmy = (e.clientY - r.top) / r.height;
    };
    const onEnter = () => { thover = 1; };
    const onLeave = () => { thover = 0; };

    const render = () => {
      mx += (tmx - mx) * 0.1; my += (tmy - my) * 0.1; hover += (thover - hover) * 0.08;
      gl.uniform2f(U("mouse"), mx, my);
      gl.uniform1f(U("hover"), hover);
      gl.uniform2f(U("res"), cv.width, cv.height);
      gl.uniform2f(U("imgRes"), imgRes[0], imgRes[1]);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(U("tex"), 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };
    resize();
    window.addEventListener("resize", resize);
    cv.addEventListener("mousemove", onMove);
    cv.addEventListener("mouseenter", onEnter);
    cv.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [src]);

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      <img ref={img} src={src} alt={alt}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "opacity .4s" }} />
      <canvas ref={canvas} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
