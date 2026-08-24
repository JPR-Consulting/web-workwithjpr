import React, { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  /** Wellenstärke: 1 = wie im Hero. Für Porträts deutlich niedriger wählen. */
  intensity?: number;
}

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uMouse;
uniform float uTime;
uniform float uStrength;
uniform float uIntensity;
uniform vec2 uAspect;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 d = (uv - uMouse) * uAspect;
  float dist = length(d);

  float ring = sin(dist * 26.0 - uTime * 2.6) * exp(-dist * 6.5);
  vec2 offset = normalize(d + 1e-5) * ring * 0.018 * uStrength * uIntensity;
  uv += offset;
  uv = clamp(uv, 0.001, 0.999);

  vec4 col = texture2D(uTex, uv);
  float sheen = clamp(ring * uStrength, 0.0, 1.0) * 0.14 * uIntensity;
  col.rgb += sheen;
  gl_FragColor = col;
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/**
 * Bild mit dezentem Wasser-Effekt beim Überfahren. Das <img> bleibt im DOM
 * (Ladeverhalten, Alt-Text, SEO); das Canvas legt sich nur darüber, sobald
 * WebGL und Bild bereit sind. Ohne WebGL/Touch/reduced-motion bleibt es beim Bild.
 */
const WaterImage: React.FC<Props> = ({ src, alt, className = '', intensity = 0.45 }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const host = hostRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!host || !img || !canvas) return;

    let disposed = false;
    let raf = 0;
    let cleanupGl: (() => void) | null = null;

    const boot = () => {
      if (disposed || !img.complete || img.naturalWidth === 0) return;

      const gl = (canvas.getContext('webgl', { alpha: true }) ||
        canvas.getContext('experimental-webgl', { alpha: true })) as WebGLRenderingContext | null;
      if (!gl) return;

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return;
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(prog, 'aPos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const uTex = gl.getUniformLocation(prog, 'uTex');
      const uMouse = gl.getUniformLocation(prog, 'uMouse');
      const uTime = gl.getUniformLocation(prog, 'uTime');
      const uStrength = gl.getUniformLocation(prog, 'uStrength');
      const uIntensity = gl.getUniformLocation(prog, 'uIntensity');
      const uAspect = gl.getUniformLocation(prog, 'uAspect');

      // Bild "cover"-gerecht in ein Offscreen-Canvas zeichnen, damit die
      // Textur dasselbe Seitenverhältnis zeigt wie das gestylte <img>.
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const c2 = off.getContext('2d');
      if (!c2) return;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      c2.drawImage(img, (w - dw) / 2, 0, dw, dh); // object-position: top

      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);

      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uAspect, rect.width / rect.height, 1);
      gl.uniform1f(uIntensity, intensity);

      const start = performance.now();
      let strength = 0;
      let target = 0;
      const mouse = { x: 0.5, y: 0.5 };
      const smooth = { x: 0.5, y: 0.5 };

      const loop = () => {
        if (disposed) return;
        strength += (target - strength) * 0.08;
        smooth.x += (mouse.x - smooth.x) * 0.12;
        smooth.y += (mouse.y - smooth.y) * 0.12;
        gl.uniform2f(uMouse, smooth.x, smooth.y);
        gl.uniform1f(uTime, (performance.now() - start) / 1000);
        gl.uniform1f(uStrength, strength);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(uTex, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        raf = requestAnimationFrame(loop);
      };

      const onMove = (e: MouseEvent) => {
        const r = host.getBoundingClientRect();
        mouse.x = (e.clientX - r.left) / r.width;
        mouse.y = 1 - (e.clientY - r.top) / r.height;
        target = 1;
      };
      const onLeave = () => {
        target = 0;
      };
      host.addEventListener('mousemove', onMove);
      host.addEventListener('mouseleave', onLeave);

      setActive(true);
      loop();

      cleanupGl = () => {
        host.removeEventListener('mousemove', onMove);
        host.removeEventListener('mouseleave', onLeave);
        gl.deleteTexture(tex);
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
      };
    };

    if (img.complete) boot();
    else img.addEventListener('load', boot, { once: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanupGl?.();
    };
  }, [src, intensity]);

  return (
    <div ref={hostRef} className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={active ? { opacity: 0 } : undefined}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ display: active ? 'block' : 'none' }}
      />
    </div>
  );
};

export default WaterImage;
